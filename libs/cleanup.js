import File from "../models/mongo";
import cloudinary from "../libs/cloudinary";

// Function to delete expired files
const deleteExpiredFiles = async () => {
  const now = new Date();
  const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const expiredFiles = await File.find({ createdAt: { $lte: new Date(now - expirationTime) } });

  for (let file of expiredFiles) {
    try {
      // Delete file from Cloudinary
      await cloudinary.uploader.destroy(file.public_id);
      console.log(`File with ID ${file.public_id} deleted from Cloudinary`);

      // Remove file record from MongoDB
      await File.findByIdAndDelete(file._id);
      console.log(`File with ID ${file._id} deleted from MongoDB`);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }
};

// Call the function every hour (adjust interval as needed)
setInterval(deleteExpiredFiles, 60 * 60 * 1000); // Every 1 hour
