import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-memory store for demo
let companies = [
  { id: 1, compname: 'Yamaha' },
  { id: 2, compname: 'Honda' }
];
let nextId = 3;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// GET /api/companies
app.get('/api/companies', (req, res) => {
  res.json(companies);
});

// POST /api/companies { compname }
app.post('/api/companies', (req, res) => {
  const { compname } = req.body || {};
  if (!compname) return res.status(400).json('Company name is required');
  const company = { id: nextId++, compname };
  companies.push(company);
  res.json('Company saved successfully');
});

// DELETE /api/companies/:id
app.delete('/api/companies/:id', (req, res) => {
  const id = Number(req.params.id);
  companies = companies.filter(c => c.id !== id);
  res.json('Company deleted successfully');
});

app.listen(port, () => {
  console.log(`Companies service listening on ${port}`);
});

