import rateLimit from 'express-rate-limit'

export const authRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 100,
    message: "Too many login attempts. Please try again later.",
});
  

export const publicRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 300,
    message: "You have exceeded the rate limit.",
});

