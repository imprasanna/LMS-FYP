const multer = require("multer");
const path = require("path");
const Subject = require("../models/subjectSchema");

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File Filter Logic
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only PDF and DOC files are allowed."));
  }
};

// Multer Middleware
const upload = multer({ storage, fileFilter });

// File Upload Handler
const uploadFile = async (req, res) => {
  try {
    const { subjectName, sessions } = req.body; // Extract form fields
    const syllabusFile = req.file; // Uploaded file details

    if (!syllabusFile) {
      return res
        .status(400)
        .json({ message: "File upload failed. Please upload a valid file." });
    }

    // Save file metadata and other details to the database
    const newSubject = new Subject({
      subjectName,
      sessions: Number(sessions),
      filePath: syllabusFile.path,
    });

    await newSubject.save();

    res.status(200).json({
      message: "Subject added successfully!",
      filePath: syllabusFile.path, // Return file path for further use
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Could not upload file." });
  }
};

module.exports = { upload, uploadFile };
