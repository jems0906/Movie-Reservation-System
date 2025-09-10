const express = require('express');
const { sequelize } = require('./models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

const SECRET = 'your_jwt_secret';

// Auth middleware
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
        if (!user || user.role !== role) return res.sendStatus(403);
        next();
    };
}

// Controllers (imported from separate files)
const userController = require('./controllers/userController');
const movieController = require('./controllers/movieController');
const showtimeController = require('./controllers/showtimeController');
const reservationController = require('./controllers/reservationController');
const reportController = require('./controllers/reportController');

// User routes
app.post('/signup', userController.signup);
app.post('/login', userController.login);
app.post('/users/:id/promote', authenticateToken, requireRole('admin'), userController.promote);

// Movie routes
app.post('/movies', authenticateToken, requireRole('admin'), movieController.create);
app.put('/movies/:id', authenticateToken, requireRole('admin'), movieController.update);
app.delete('/movies/:id', authenticateToken, requireRole('admin'), movieController.remove);
app.get('/movies', movieController.list);

// Showtime routes
app.post('/movies/:id/showtimes', authenticateToken, requireRole('admin'), showtimeController.create);
app.get('/showtimes', showtimeController.list);

// Reservation routes
app.post('/showtimes/:id/reserve', authenticateToken, reservationController.reserve);
app.get('/reservations', authenticateToken, reservationController.list);
app.post('/reservations/:id/cancel', authenticateToken, reservationController.cancel);

// Reporting route
app.get('/admin/report', authenticateToken, requireRole('admin'), reportController.report);

sequelize.sync().then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
});