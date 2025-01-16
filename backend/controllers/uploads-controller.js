const multer = require("multer");
const path = require("path");
const Subject = require("../models/subjectSchema");

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/");
    cb(null, uploadDir);
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
    const { subjectName, subCode, sessions } = req.body;
    const syllabusFile = req.file;

    if (!syllabusFile) {
      return res
        .status(400)
        .json({ message: "No file uploaded. Please upload a valid file." });
    }

    if (!subjectName || !subCode || !sessions) {
      return res.status(400).json({
        message: "All fields (subjectName, subCode, sessions) are required.",
      });
    }

    // Set a default sclassName if not provided
    const defaultSclassName = "640ab1234abc5678def90123"; // Replace with actual class ID from your database

    const newSubject = new Subject({
      subName: subjectName,
      subCode,
      sessions: Number(sessions),
      filePath: syllabusFile.path,
      sclassName: defaultSclassName, // Pass default class ID
    });

    await newSubject.save();

    res.status(200).json({
      message: "Subject added successfully!",
      filePath: syllabusFile.path,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Server error occurred." });
  }
};

module.exports = { upload, uploadFile };
