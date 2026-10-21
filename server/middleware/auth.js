const { auth } = require('../auth/auth');

const isAuthenticated = async (req, res, next) => {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Please log in' });
    }
    req.user = session.user;
    next();
};

const isAdmin = async (req, res, next) => {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || session.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
    req.user = session.user;
    next();
};

const optionalAuth = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        req.user = session?.user || null;
    } catch {
        req.user = null;
    }
    next();
};

module.exports = { isAuthenticated, isAdmin, optionalAuth };