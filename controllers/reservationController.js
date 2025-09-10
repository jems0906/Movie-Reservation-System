const { Reservation, Showtime, Seat, sequelize } = require('../models');

exports.reserve = async (req, res) => {
    try {
        const { showtimeId, seatNumber } = req.body;
        const userId = req.user.id;
        if (!showtimeId || !seatNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Find seat
        const seat = await Seat.findOne({ where: { ShowtimeId: showtimeId, seatNumber } });
        if (!seat || seat.status === 'reserved') {
            return res.status(400).json({ error: 'Seat not available' });
        }
        // Reserve seat
        seat.status = 'reserved';
        await seat.save();
        // Create reservation
        const reservation = await Reservation.create({ UserId: userId, ShowtimeId: showtimeId });
        await reservation.addSeat(seat);
        res.status(201).json(reservation);
    } catch (e) {
        res.status(400).json({ error: 'Reservation failed' });
    }
};

exports.list = async (req, res) => {
    try {
        const userId = req.user.id;
        const reservations = await Reservation.findAll({ where: { UserId: userId }, include: ["Showtime", "Seats"] });
        res.json(reservations);
    } catch (e) {
        res.status(400).json({ error: 'Failed to list reservations' });
    }
};

exports.cancel = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id, { include: ["Seats"] });
        if (!reservation || reservation.UserId !== req.user.id) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        // Free the seats
        for (const seat of reservation.Seats) {
            seat.status = 'available';
            await seat.save();
        }
        reservation.status = 'cancelled';
        await reservation.save();
        res.json({ message: 'Reservation cancelled' });
    } catch (e) {
        res.status(400).json({ error: 'Cancellation failed' });
    }
};
