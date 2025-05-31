import jwt from "jsonwebtoken";
import { create_error } from "../utils/error.js";

// Use a hardcoded secret for now (will be replaced with env variable later)
const JWT_SECRET = "msa";

export const verifyToken = (req, res, next) => {
    // Check for token in cookies or Authorization header
    let token = req.cookies.access_token;
    
    // If no cookie token, check for Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return next(create_error(401, "You are not authenticated"));
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return next(create_error(403, "Token is not valid"));
        }
        req.user = user;
        next();
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        if (req.user.id == req.params.id || req.user.admin) {
            next();
        } else {
            return next(create_error(403, "You are not authorized"));
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        if (req.user.admin) {
            next();
        } else {
            return next(create_error(403, "You are not authorized"));
        }
    });
};
