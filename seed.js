const { sequelize, User } = require('./models');

async function seed() {
    await sequelize.sync({ force: true });
    const bcrypt = require('bcrypt');
    const { Movie, Showtime, Seat } = require('./models');

    // Create users
    const adminPass = await bcrypt.hash('adminpass', 10);
    const userPass = await bcrypt.hash('userpass', 10);
    await User.create({ username: 'admin', password: adminPass, role: 'admin' });
    await User.create({ username: 'user1', password: userPass, role: 'user' });

    // Create movies
    const movie1 = await Movie.create({
        title: 'Inception',
        description: 'A mind-bending thriller by Christopher Nolan.',
        poster: 'https://example.com/inception.jpg',
        genre: 'Sci-Fi'
    });
    const movie2 = await Movie.create({
        title: 'The Matrix',
        description: 'A hacker discovers reality is a simulation.',
        poster: 'https://example.com/matrix.jpg',
        genre: 'Action'
    });

    // Create showtimes
    const showtime1 = await Showtime.create({
        date: new Date('2025-08-28T19:00:00'),
        auditorium: 'A',
        MovieId: movie1.id
    });
    const showtime2 = await Showtime.create({
        date: new Date('2025-08-28T21:00:00'),
        auditorium: 'B',
        MovieId: movie2.id
    });

    // Create seats for showtime1
    for (let i = 1; i <= 10; i++) {
        await Seat.create({ seatNumber: `A${i}`, status: 'available', ShowtimeId: showtime1.id });
    }
    // Create seats for showtime2
    for (let i = 1; i <= 8; i++) {
        await Seat.create({ seatNumber: `B${i}`, status: 'available', ShowtimeId: showtime2.id });
    }
}

seed();