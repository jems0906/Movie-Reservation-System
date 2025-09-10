const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:@J@mes0609@localhost:5432/moviereservation');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            len: [3, 50]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100]
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
        allowNull: false,
        validate: {
            isIn: [['admin', 'user']]
        }
    }
});

const Movie = sequelize.define('Movie', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 100]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [1, 1000]
        }
    },
    poster: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 50]
        }
    }
});

const Showtime = sequelize.define('Showtime', {
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    auditorium: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 50]
        }
    }
});

const Seat = sequelize.define('Seat', {
    seatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 10]
        }
    },
    status: {
        type: DataTypes.ENUM('available', 'reserved'),
        defaultValue: 'available',
        allowNull: false,
        validate: {
            isIn: [['available', 'reserved']]
        }
    }
});

const Reservation = sequelize.define('Reservation', {
    status: {
        type: DataTypes.ENUM('active', 'cancelled'),
        defaultValue: 'active',
        allowNull: false,
        validate: {
            isIn: [['active', 'cancelled']]
        }
    }
});

// Relationships
Movie.hasMany(Showtime);
Showtime.belongsTo(Movie);

Showtime.hasMany(Seat);
Seat.belongsTo(Showtime);

User.hasMany(Reservation);
Reservation.belongsTo(User);

Showtime.hasMany(Reservation);
Reservation.belongsTo(Showtime);

Reservation.belongsToMany(Seat, { through: 'ReservationSeats' });
Seat.belongsToMany(Reservation, { through: 'ReservationSeats' });

module.exports = { sequelize, User, Movie, Showtime, Seat, Reservation };