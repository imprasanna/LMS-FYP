const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  sclassName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sclass",
    required: true,
  },
  subName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    required: true,
  },
  teacherName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    required: true,
  },
  videos: [
    {
      chapter: { type: String, required: true },
      videoUrl: { type: String, required: true },
    },
  ],
});

// Middleware to validate ObjectId before saving
uploadSchema.pre("save", function (next) {
  if (
    !mongoose.Types.ObjectId.isValid(this.school) ||
    !mongoose.Types.ObjectId.isValid(this.sclassName) ||
    !mongoose.Types.ObjectId.isValid(this.subName) ||
    !mongoose.Types.ObjectId.isValid(this.teacherName)
  ) {
    return next(new Error("Invalid ObjectId format."));
  }
  next();
});

module.exports = mongoose.model("upload", uploadSchema);
