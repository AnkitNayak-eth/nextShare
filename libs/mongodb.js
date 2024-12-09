import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
};

export default connectDB;
