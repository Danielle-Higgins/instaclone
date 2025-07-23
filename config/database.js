const mongoose = require("mongoose");

// connecting to our database using mongoose
const connectDB = async () => {
  try {
    // pass in connection string and options to avoid warnings in the console
    const conn = await mongoose.connect(process.env.DB_STRING);

    // logs host to console (cluster name)
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err); // log any errors
    process.exit(1); // stop everything
  }
};

module.exports = connectDB; // exporting the function
