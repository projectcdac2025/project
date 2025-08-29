import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Service discovery via env or defaults
const services = {
  companies: process.env.SVC_COMPANIES_URL || 'http://localhost:4001',
  variants: process.env.SVC_VARIANTS_URL || 'http://localhost:4002',
  bikes: process.env.SVC_BIKES_URL || 'http://localhost:4003',
  customers: process.env.SVC_CUSTOMERS_URL || 'http://localhost:4004',
  bookings: process.env.SVC_BOOKINGS_URL || 'http://localhost:4005',
  payments: process.env.SVC_PAYMENTS_URL || 'http://localhost:4006',
  admin: process.env.SVC_ADMIN_URL || 'http://localhost:4007'
};

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Route mapping based on frontend expectations
app.use(
  '/api/companies',
  createProxyMiddleware({
    target: services.companies,
    changeOrigin: true,
    pathRewrite: (path) => `/api/companies${path}`
  })
);
app.use(
  '/api/variants',
  createProxyMiddleware({
    target: services.variants,
    changeOrigin: true,
    pathRewrite: (path) => `/api/variants${path}`
  })
);
app.use(
  '/api/bikes',
  createProxyMiddleware({
    target: services.bikes,
    changeOrigin: true,
    pathRewrite: (path) => `/api/bikes${path}`
  })
);
app.use(
  '/api/customers',
  createProxyMiddleware({
    target: services.customers,
    changeOrigin: true,
    pathRewrite: (path) => `/api/customers${path}`
  })
);
// Payments must come before the generic bookings proxy to avoid being swallowed
app.use(
  '/api/bookings/payments',
  createProxyMiddleware({
    target: services.payments,
    changeOrigin: true,
    pathRewrite: (path) => `/api/bookings/payments${path}`
  })
);
app.use(
  '/api/bookings',
  createProxyMiddleware({
    target: services.bookings,
    changeOrigin: true,
    pathRewrite: (path) => `/api/bookings${path}`
  })
);
app.use(
  '/api/admin',
  createProxyMiddleware({
    target: services.admin,
    changeOrigin: true,
    pathRewrite: (path) => `/api/admin${path}`
  })
);

app.listen(port, () => {
  console.log(`Gateway listening on port ${port}`);
});

