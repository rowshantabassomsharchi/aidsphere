import connectDB from './config/db.js'; // note the .js at the end

const testConnection = async () => {
  await connectDB(); // Will print MongoDB Connected if successful
  process.exit(0);   // Exit after testing
};

testConnection();