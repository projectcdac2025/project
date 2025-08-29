import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-memory bikes
let bikes = [
  { id: 1, bname: 'R15 V4', variantId: 1, regno: 'MH01AB1234' },
  { id: 2, bname: 'Unicorn 160', variantId: 2, regno: 'MH02CD5678' }
];
let nextId = 3;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// GET /api/bikes
app.get('/api/bikes', (req, res) => {
  res.json(bikes);
});

// GET /api/bikes/variants/:variantId -> list bikes by variant
app.get('/api/bikes/variants/:variantId', (req, res) => {
  const variantId = Number(req.params.variantId);
  res.json(bikes.filter(b => b.variantId === variantId));
});

// GET /api/bikes/filter/:variantId (compat from legacy component)
app.get('/api/bikes/filter/:variantId', (req, res) => {
  const variantId = Number(req.params.variantId);
  res.json(bikes.filter(b => b.variantId === variantId));
});

// POST /api/bikes
app.post('/api/bikes', (req, res) => {
  const { bname, variantId, regno } = req.body || {};
  if (!bname) return res.status(400).json('Bike name is required');
  const bike = { id: nextId++, bname, variantId: variantId ? Number(variantId) : null, regno: regno || '' };
  bikes.push(bike);
  res.json('Bike saved successfully');
});

// DELETE /api/bikes/:id
app.delete('/api/bikes/:id', (req, res) => {
  const id = Number(req.params.id);
  bikes = bikes.filter(b => b.id !== id);
  res.json('Bike deleted successfully');
});

app.listen(port, () => {
  console.log(`Bikes service listening on ${port}`);
});

