import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4007;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const adminUser = { username: 'admin', password: 'admin' };

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// POST /api/admin/validate
app.post('/api/admin/validate', (req, res) => {
  const { username, password } = req.body || {};
  if (username === adminUser.username && password === adminUser.password) {
    return res.json({ username });
  }
  res.status(401).json('Invalid admin credentials');
});

// GET /api/admin/dashboard
app.get('/api/admin/dashboard', (req, res) => {
  // Return some fake metrics
  res.json({ totalCompanies: 2, totalVariants: 2, totalBikes: 2, totalBookings: 1, totalPayments: 1 });
});

app.listen(port, () => {
  console.log(`Admin service listening on ${port}`);
});

