"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const auth_1 = require("./auth");
const authenticateJWT = (req, res, next) => {
    const token = req.session.jwt;
    if (!token || !req.session.isAuthenticated) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const decoded = (0, auth_1.verifyToken)(token);
    if (!decoded) {
        res.status(403).json({ message: 'Invalid token' });
        return;
    }
    //req.session.user = decoded as object;
    next();
};
exports.authenticateJWT = authenticateJWT;
