const mongoose = require('mongoose');

/**
 * Robust MongoDB connector with retry/backoff.
 * Use from server startup or seeds to ensure connection attempts
 * and clearer logging when Mongo isn't available.
 */
const connectDB = async (uri, options = {}) => {
  const maxAttempts = options.maxAttempts || 6;
  const baseDelay = options.baseDelay || 1000; // ms

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log(`MongoDB connected (attempt ${attempt})`);
      return mongoose.connection;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed: ${err.message}`);
      if (attempt === maxAttempts) {
        console.error('Exceeded max MongoDB connection attempts.');
        throw err;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${Math.round(delay / 1000)}s...`);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Error during MongoDB disconnect', err);
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
