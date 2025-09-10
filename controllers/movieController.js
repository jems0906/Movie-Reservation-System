const { Movie, Showtime } = require('../models');

exports.create = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.json(movie);
    } catch (e) {
        res.status(400).json({ error: 'Invalid movie data' });
    }
};

exports.update = async (req, res) => {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.sendStatus(404);
    try {
        await movie.update(req.body);
        res.json(movie);
    } catch (e) {
        res.status(400).json({ error: 'Invalid update data' });
    }
};

exports.remove = async (req, res) => {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.sendStatus(404);
    await movie.destroy();
    res.sendStatus(204);
};

exports.list = async (req, res) => {
    const movies = await Movie.findAll({ include: Showtime });
    res.json(movies);
};
