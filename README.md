# MilStock

MilStock is a React and JavaScript frontend with a Node.js, Express, MongoDB, and Mongoose backend.

## How demo data works

MongoDB data is not stored inside Git. Each device has its own MongoDB database, so after cloning the project you must seed the demo data once.

The public demo dataset is stored in `backend/seed/seed.js`. Running the seed script creates the same users, products, warehouses, suppliers, orders, stock records, consumption records, movements, and notifications on any device.

## New device setup

From the project root:

```bash
npm run setup:demo
```

This command:

- creates `backend/.env` and `front-end/.env` from the example files if they do not exist
- installs backend and frontend dependencies
- seeds MongoDB with the MilStock demo food inventory data

Then run the app in two terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`
- API health: `http://localhost:5001/api/health`

Demo credentials:

- `admin@milstock.local` / `Password123!`
- `kitchen@milstock.local` / `Password123!`

## Environment variables

Backend:

- `PORT=5001`
- `MONGODB_URI=mongodb+srv://amal:rE0p6RBsLOSxCR8A@cluster0.9wcceti.mongodb.net/milstock?appName=Cluster0`
- `JWT_SECRET=change_this_to_a_long_random_secret`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=http://localhost:5173`

Frontend:

- `VITE_API_BASE_URL=http://localhost:5001/api`

## Hosted/shared database option

Every device now uses the same hosted MongoDB Atlas database by default. Any add, edit, or delete through the backend API is shared between English and Arabic screens because both call the same API.

If you want to switch back to a local database later, use this in `backend/.env`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/milstock
```

For production, avoid committing real database passwords to Git. Share them privately or use deployment environment variables.
