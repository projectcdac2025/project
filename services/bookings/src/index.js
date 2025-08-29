import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-memory bookings
let bookings = [
  { id: 1, userid: 1, variantId: 1, bno: 1, status: 'CREATED', startDate: '2024-01-01', endDate: '2024-01-05' }
];
let nextId = 2;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// GET /api/bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// GET /api/bookings/:id
app.get('/api/bookings/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = bookings.find(b => b.id === id);
  if (!found) return res.status(404).json('Booking not found');
  res.json(found);
});

// GET /api/bookings/users?userid=ID
app.get('/api/bookings/users', (req, res) => {
  const userid = Number(req.query.userid);
  res.json(bookings.filter(b => b.userid === userid));
});

// POST /api/bookings
app.post('/api/bookings', (req, res) => {
  const { userid, variantId, startDate, endDate } = req.body || {};
  const booking = { id: nextId++, userid: Number(userid) || null, variantId: Number(variantId) || null, bno: null, status: 'CREATED', startDate: startDate || null, endDate: endDate || null };
  bookings.push(booking);
  res.json('Booking created successfully');
});

// PUT /api/bookings/:id { bno }
app.put('/api/bookings/:id', (req, res) => {
  const id = Number(req.params.id);
  const { bno } = req.body || {};
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json('Booking not found');
  bookings[idx] = { ...bookings[idx], bno: Number(bno) };
  res.json('Booking updated successfully');
});

// PUT /api/bookings/complete/:id -> complete with feedback data
app.put('/api/bookings/complete/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json('Booking not found');
  bookings[idx] = { ...bookings[idx], status: 'COMPLETED', feedback: req.body?.feedback || null, rating: req.body?.rating || null };
  res.json('Booking completed successfully');
});

// DELETE /api/bookings/:id
app.delete('/api/bookings/:id', (req, res) => {
  const id = Number(req.params.id);
  bookings = bookings.filter(b => b.id !== id);
  res.json('Booking cancelled successfully');
});

app.listen(port, () => {
  console.log(`Bookings service listening on ${port}`);
});

