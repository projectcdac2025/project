## Microservices Setup

Services:
- Gateway (8080)
- Companies (4001)
- Variants (4002)
- Bikes (4003)
- Customers (4004)
- Bookings (4005)
- Payments (4006)
- Admin (4007)

### Run locally (without Docker)

In separate terminals:

```
node services/companies/src/index.js
node services/variants/src/index.js
node services/bikes/src/index.js
node services/customers/src/index.js
node services/bookings/src/index.js
node services/payments/src/index.js
node services/admin/src/index.js
node services/gateway/src/index.js
```

Or use `npm start` inside each service directory after `npm install`.

### Run with Docker Compose

```
docker compose up --build
```

Gateway will be available at http://localhost:8080

### Frontend Config

Create `frontendd/.env` with:

```
REACT_APP_BACKEND_URL=http://localhost:8080/
```

