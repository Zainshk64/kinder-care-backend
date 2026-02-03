import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const connectDB = async () => {
  const uri =
    process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "Missing MongoDB connection string. Set `MONGODB_URI` or `MONGODB_URL` in your .env"
    );
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
};

export default connectDB  ;
