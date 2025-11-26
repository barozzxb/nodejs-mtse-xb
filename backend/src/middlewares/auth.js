import 'dotenv/config';

import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const white_lists = ['/', '/register', '/login', '/products/add', '/products'];
    if (white_lists.some(item => req.originalUrl.startsWith('/api/v1' + item))) {
        return next();
    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    email: decoded.email,
                    name: decoded.name
                }
                console.log('>>>check token: ', decoded);
                next();
            } catch (error) {
                return { success: false, message: "Token expired or not valid", data: null }
            }
        } else {
            return { success: false, message: "Cannot find token", data: null }
        }
    }
}

export default auth;