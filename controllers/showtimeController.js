const { Movie, Showtime, Seat, sequelize } = require('../models');

exports.create = async (req, res) => {
    try {
        const { date, auditorium, seats } = req.body;
        const movieId = req.params.id;
        if (!date || !auditorium || !seats || !movieId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const showtime = await Showtime.create({ date, auditorium, MovieId: movieId });
        // Create seats for this showtime
        const seatObjs = seats.map(seatNum => ({ seatNumber: seatNum, status: 'available', ShowtimeId: showtime.id }));
        await Seat.bulkCreate(seatObjs);
        res.status(201).json(showtime);
    } catch (e) {
        res.status(400).json({ error: 'Showtime creation failed' });
    }
};

exports.list = async (req, res) => {
    try {
        const showtimes = await Showtime.findAll({ include: ["Movie", "Seats"] });
        res.json(showtimes);
    } catch (e) {
        res.status(400).json({ error: 'Failed to list showtimes' });
    }
};
