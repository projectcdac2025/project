import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-memory variants with optional company relation
let variants = [
  { id: 1, name: 'YZF R15', companyId: 1 },
  { id: 2, name: 'Unicorn', companyId: 2 }
];
let nextId = 3;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// GET /api/variants
app.get('/api/variants', (req, res) => {
  res.json(variants);
});

// GET /api/variants/:id
app.get('/api/variants/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = variants.find(v => v.id === id);
  if (!item) return res.status(404).json('Variant not found');
  res.json(item);
});

// GET /api/variants/company/:cid
app.get('/api/variants/company/:cid', (req, res) => {
  const companyId = Number(req.params.cid);
  res.json(variants.filter(v => v.companyId === companyId));
});

// POST /api/variants
app.post('/api/variants', (req, res) => {
  const { name, companyId } = req.body || {};
  if (!name) return res.status(400).json('Variant name is required');
  const variant = { id: nextId++, name, companyId: companyId ? Number(companyId) : null };
  variants.push(variant);
  res.json('Variant saved successfully');
});

// PUT /api/variants/:id
app.put('/api/variants/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, companyId } = req.body || {};
  const idx = variants.findIndex(v => v.id === id);
  if (idx === -1) return res.status(404).json('Variant not found');
  variants[idx] = { ...variants[idx], name: name ?? variants[idx].name, companyId: companyId ?? variants[idx].companyId };
  res.json('Variant updated successfully');
});

// DELETE /api/variants/:id
app.delete('/api/variants/:id', (req, res) => {
  const id = Number(req.params.id);
  variants = variants.filter(v => v.id !== id);
  res.json('Variant deleted successfully');
});

app.listen(port, () => {
  console.log(`Variants service listening on ${port}`);
});

