import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

let customers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', password: 'alice', phone: '1111111111' },
  { id: 2, name: 'Bob', email: 'bob@example.com', password: 'bob', phone: '2222222222' }
];
let nextId = 3;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// GET /api/customers
app.get('/api/customers', (req, res) => {
  res.json(customers.map(({ password, ...rest }) => rest));
});

// POST /api/customers
app.post('/api/customers', (req, res) => {
  const { name, email, password, phone } = req.body || {};
  if (!email || !password) return res.status(400).json('Email and password required');
  const user = { id: nextId++, name: name || '', email, password, phone: phone || '' };
  customers.push(user);
  res.json('Customer registered successfully');
});

// POST /api/customers/validate
app.post('/api/customers/validate', (req, res) => {
  const { email, password } = req.body || {};
  const found = customers.find(c => c.email === email && c.password === password);
  if (!found) return res.status(401).json('Invalid credentials');
  const { password: _, ...safe } = found;
  res.json(safe);
});

app.listen(port, () => {
  console.log(`Customers service listening on ${port}`);
});

