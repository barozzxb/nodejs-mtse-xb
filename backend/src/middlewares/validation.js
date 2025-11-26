import { body, validationResult } from 'express-validator';

export const validateLogin = [
    body('email').isEmail(),
    body('password').exists(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({EC: 1, EM: "Dữ liệu không hợp lệ", details: errors.array()});

        }
        next();
    }
];

export const validateRegister = [
    body('email').isEmail(),
    body('password').exists().isLength({min: 8}),
    body('name').exists(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({EC: 1, EM: "Dữ liệu không hợp lệ", details: errors.array()});

        }
        next();
    }
];