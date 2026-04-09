# Birth Certificate Hub — Backend

Node.js + Express + MongoDB backend for the Birth Certificate Hub project.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start MongoDB locally (default: mongodb://127.0.0.1:27017/birthhub)

3. Run the server:
   ```
   node server.js
   ```

Server runs on port 5000 by default.

## API Endpoints

### Auth
- `POST /api/auth/wallet-login` — Login with wallet address & role

### Records
- `POST /api/records` — Create birth record (hospital role)
- `GET /api/records` — List all records
- `GET /api/records/:certId` — Get single record
- `PUT /api/records/:certId/approve` — Approve record (registrar role)
- `POST /api/records/:certId/verify` — Verify record

### Transactions
- `GET /api/transactions` — List gas transactions

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| MONGO_URI | mongodb://127.0.0.1:27017/birthhub | MongoDB connection |
| JWT_SECRET | birth_hub_jwt_secret_change_me | JWT signing secret |

## Gas Tracking

Every action (create, approve, verify) logs a 0.01 gas fee transaction.
