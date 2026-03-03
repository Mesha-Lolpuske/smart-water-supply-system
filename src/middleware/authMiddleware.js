import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // If token doesn't include role (older tokens), fetch role from DB
        if (!decoded.role) {
            try {
                const userRecord = await User.findById(decoded.id).select('role');
                decoded.role = userRecord ? userRecord.role : 'user';
            } catch (e) {
                console.log('Error fetching user role:', e.message);
            }
        }
        req.user = decoded; // Adds user info (id and role) to the request object
        next();
    } catch (error) {
        res.status(410).json({ message: "Token is not valid" });
    }
};

// Middleware to check if user is an Admin
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};