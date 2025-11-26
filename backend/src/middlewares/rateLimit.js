import rateLimit from 'express-rate-limit';

export const apiLimit = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message: "Nhiều lượt truy cập từ IP này, thử lại sau"
})