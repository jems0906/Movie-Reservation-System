const { Reservation, Seat } = require('../models');

exports.report = async (req, res) => {
    try {
        const totalReservations = await Reservation.count();
        const totalSeats = await Seat.count();
        const reservedSeats = await Seat.count({ where: { reserved: true } });
        res.json({
            totalReservations,
            totalSeats,
            reservedSeats,
            seatUsage: totalSeats ? (reservedSeats / totalSeats) * 100 : 0
        });
    } catch (e) {
        res.status(400).json({ error: 'Failed to generate report' });
    }
};
