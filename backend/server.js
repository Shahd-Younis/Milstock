const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8888;

const start = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(() => {
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
