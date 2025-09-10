const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = 'your_jwt_secret';

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ id: user.id, username: user.username, role: user.role });
    } catch (e) {
        res.status(400).json({ error: 'User creation failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (e) {
        res.status(400).json({ error: 'Login failed' });
    }
};

exports.promote = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.role = 'admin';
        await user.save();
        res.json({ id: user.id, username: user.username, role: user.role });
    } catch (e) {
        res.status(400).json({ error: 'Promotion failed' });
    }
};
