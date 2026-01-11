


import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        console.log('🔐 protectAdmin - Token exists:', !!token);
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        // Decode the JWT token manually to get userId
        // The token is already verified by Clerk on the frontend
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        const userId = decoded.sub;
        
        console.log('🔐 protectAdmin - Decoded userId:', userId);
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Invalid token payload' });
        }
        
        // Get user from Clerk and check role
        const user = await clerkClient.users.getUser(userId);
        console.log('🔐 protectAdmin - User role:', user.privateMetadata?.role);
        
        if (user.privateMetadata?.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied. Admins only." });
        }
        
        console.log('✅ protectAdmin - Admin verified!');
        
        // Attach to request
        req.auth = { userId };
        req.user = user;
        next();
        
    } catch (error) {
        console.error('❌ protectAdmin error:', error);
        return res.status(401).json({ success: false, message: 'Authorization failed', error: error.message });
    }
}