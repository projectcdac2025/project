import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4006;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-memory payments keyed by booking id
let payments = [
  { id: 1, bookingId: 1, amount: 100.0, mode: 'CARD', date: '2024-01-02' }
];
let nextId = 2;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// GET /api/bookings/payments
app.get('/api/bookings/payments', (req, res) => {
  res.json(payments);
});

// GET /api/bookings/payments/:bookingId
app.get('/api/bookings/payments/:bookingId', (req, res) => {
  const bookingId = Number(req.params.bookingId);
  res.json(payments.filter(p => p.bookingId === bookingId));
});

// POST /api/bookings/payments
app.post('/api/bookings/payments', (req, res) => {
  const { bookingId, amount, mode, date } = req.body || {};
  const payment = { id: nextId++, bookingId: Number(bookingId), amount: Number(amount) || 0, mode: mode || 'CASH', date: date || new Date().toISOString().slice(0,10) };
  payments.push(payment);
  res.json('Payment recorded successfully');
});

app.listen(port, () => {
  console.log(`Payments service listening on ${port}`);
});

