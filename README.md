# Movie Reservation System

A backend system for reserving movie tickets. Users can sign up, log in, browse movies, view showtimes, reserve seats, and manage their reservations. Admins can manage movies, showtimes, and view reports.

## Features
- User authentication (JWT)
- Admin and regular user roles
- Movie management (CRUD for admins)
- Showtimes and seat management
- Seat reservation and cancellation
- Reporting for admins

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure PostgreSQL connection in `models.js`.
3. Seed the database:
   ```bash
   node seed.js
   ```
4. Start the server:
   ```bash
   node server.js
   ```

## API Endpoints
- `POST /signup` — Register a new user
- `POST /login` — Log in and get JWT token
- `GET /movies` — List movies
- `GET /showtimes` — List showtimes and seats
- `POST /showtimes/:id/reserve` — Reserve a seat (user only)
- `GET /reservations` — List user reservations
- `POST /reservations/:id/cancel` — Cancel a reservation
- `POST /movies` — Create movie (admin only)
- `PUT /movies/:id` — Update movie (admin only)
- `DELETE /movies/:id` — Delete movie (admin only)
- `GET /admin/report` — Admin report

## Example Users
- Admin: `admin` / `adminpass`
- User: `user1` / `userpass`

## Notes
- Use the JWT token from `/login` in the `Authorization` header for protected endpoints.
- Run `node seed.js` to reset sample data.