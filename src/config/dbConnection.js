const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Conectado a la base de datos");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
