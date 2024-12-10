import { IncomingForm } from "formidable";
import cloudinary from "../../libs/cloudinary";
import connectDB from "../../libs/mongodb";
import File from "../../models/mongo";
import fs from "fs";
import { pipeline } from "stream";
import path from "path"; // Import path module to handle file extensions

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  const form = new IncomingForm({ maxFileSize: 100 * 1024 * 1024 }); // 100MB limit

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(400).json({ message: "Error parsing form", error: err.message });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    console.log("Parsed file:", file);

    // Check if the file exists and log the filepath
    if (!file || !file.filepath) {
      console.error("File upload failed. Filepath is missing.");
      return res.status(400).json({ message: "File upload failed. Filepath is missing." });
    }

    console.log("Filepath:", file.filepath);

    try {
      // Cloudinary upload stream with custom timeout settings
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // Cloudinary will detect file type
          timeout: 120000, // Timeout in milliseconds (default is 30 seconds)
        },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: error.message });
          }

          // Save file info in MongoDB
          const fileRecord = new File({
            url: result.secure_url,
            public_id: result.public_id,
            extension: path.extname(file.originalFilename), // Save file extension from the original filename
          });

          try {
            await fileRecord.save();
            return res.status(200).json({ message: "File uploaded", url: result.secure_url });
          } catch (dbError) {
            console.error("MongoDB save error:", dbError);
            return res.status(500).json({ message: "Error saving file info to MongoDB", error: dbError.message });
          }
        }
      );

      const fileStream = fs.createReadStream(file.filepath);
      pipeline(fileStream, stream, (err) => {
        if (err) {
          console.error("Error in file upload pipeline:", err);
          return res.status(500).json({ message: "Error in file upload pipeline", error: err.message });
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: error.message });
    }
  });
}
