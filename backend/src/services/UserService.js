import 'dotenv/config';

import User from '../models/user.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;

const UserService = {
    createUser: async (name, email, password) => {
        try {
            const user = await User.findOne({ email });
            if (user) {
                return { success: false, message: "User existed", data: null };
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const result = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'User'
            })
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    login: async (email, password) => {
        try {
            const user = await User.findOne({ email });
            if (user) {
                const isMatchPassword = await bcrypt.compare(password, user.password);
                if (!isMatchPassword) {
                    return {
                        EC: 2,
                        EM: "EMail/Password invalid"
                    }
                } else {
                    const payload = {
                        email: user.email,
                        name: user.name
                    }

                    const access_token = jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        {
                            expiresIn: process.env.JWT_EXPIRE
                        }
                    )
                    return {
                        EC: 0,
                        access_token,
                        user: {
                            email: user.email,
                            name: user.name
                        }
                    };
                }
            } else {
                return { EC:1,
                    EM: "Email or password not invalid"}
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    getUser: async () => {
        try {
            let result = await User.find({}).select('-password');
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

export default UserService;