const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\x1b[36m[DB] MongoDB connected: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m[DB] Error: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

module.exports = connectDB;
