const jwt = require('jsonwebtoken');
const { User } = require('./models');

const SECRET = 'your_jwt_secret';

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function requireRole(role) {
    return async (req, res, next) => {
        const user = await User.findByPk(req.user.id);
        if (user.role !== role) return res.sendStatus(403);
        next();
    };
}

module.exports = { authenticateToken, requireRole, SECRET };