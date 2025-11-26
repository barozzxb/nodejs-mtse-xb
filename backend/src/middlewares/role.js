export function authorizeRole(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ EC: 3, EM: "Not authorized" });
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient rights' });
        }
        next();
    };
}