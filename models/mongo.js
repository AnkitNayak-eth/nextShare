import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true }, // Store Cloudinary public_id
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // 24 hours
});

export default mongoose.models.File || mongoose.model("File", fileSchema);
