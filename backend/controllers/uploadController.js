const Upload = require("../models/uploadSchema");
const mongoose = require("mongoose");

const uploadVideo = async (req, res) => {
  const { school, sclassName, subName, teacherName, chapter, videoUrl } =
    req.body;

  // Validate ObjectId fields
  if (
    !mongoose.Types.ObjectId.isValid(school) ||
    !mongoose.Types.ObjectId.isValid(sclassName) ||
    !mongoose.Types.ObjectId.isValid(subName) ||
    !mongoose.Types.ObjectId.isValid(teacherName)
  ) {
    return res
      .status(400)
      .json({
        error: "Invalid ID format for school, class, subject, or teacher.",
      });
  }

  try {
    let existingVideo = await Upload.findOne({
      school,
      sclassName,
      subName,
      teacherName,
    });

    if (existingVideo) {
      const chapterExists = existingVideo.videos.some(
        (video) => video.chapter === chapter
      );
      if (chapterExists) {
        return res.status(400).json({ error: "This chapter already exists." });
      }

      existingVideo.videos.push({ chapter, videoUrl });
      await existingVideo.save();
      return res
        .status(200)
        .json({ message: "Video added successfully to the existing subject." });
    }

    const newVideo = new Upload({
      school,
      sclassName,
      subName,
      teacherName,
      videos: [{ chapter, videoUrl }],
    });
    await newVideo.save();
    return res.status(201).json({ message: "Video uploaded successfully." });
  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllVideos = async (req, res) => {
  const { school, sclassName, subName, teacherName } = req.body;

  if (!mongoose.Types.ObjectId.isValid(teacherName)) {
    return res.status(400).json({ error: "Invalid teacher ID format." });
  }

  try {
    const existingVideo = await Upload.findOne({
      school,
      sclassName,
      subName,
      teacherName,
    });
    if (!existingVideo) {
      return res
        .status(404)
        .json({ error: "No videos found for this teacher." });
    }
    return res
      .status(200)
      .json({
        status: "success",
        message: "Fetched successfully",
        videos: existingVideo.videos,
      });
  } catch (err) {
    console.error("Fetch Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getVideo = async (req, res) => {
  const { school, sclassName, subName, teacherName, chapterId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(teacherName) ||
    !mongoose.Types.ObjectId.isValid(chapterId)
  ) {
    return res.status(400).json({ error: "Invalid ID format." });
  }

  try {
    const existingVideo = await Upload.findOne({
      school,
      sclassName,
      subName,
      teacherName,
    });
    if (!existingVideo) {
      return res.status(404).json({ error: "Video not found" });
    }

    const video = existingVideo.videos.find(
      (video) => video._id.toString() === chapterId
    );
    if (!video) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    return res
      .status(200)
      .json({ status: "success", message: "Fetched successfully", video });
  } catch (err) {
    console.error("Fetch Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const editVideo = async (req, res) => {
  const {
    school,
    sclassName,
    subName,
    teacherName,
    chapterId,
    chapter,
    videoUrl,
  } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(teacherName) ||
    !mongoose.Types.ObjectId.isValid(chapterId)
  ) {
    return res.status(400).json({ error: "Invalid ID format." });
  }

  try {
    const existingVideo = await Upload.findOne({
      school,
      sclassName,
      subName,
      teacherName,
    });
    if (!existingVideo) {
      return res.status(404).json({ error: "Video not found" });
    }

    const video = existingVideo.videos.find(
      (video) => video._id.toString() === chapterId
    );
    if (!video) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    video.chapter = chapter;
    video.videoUrl = videoUrl;
    await existingVideo.save();

    return res
      .status(200)
      .json({ status: "success", message: "Video updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteVideo = async (req, res) => {
  const { school, sclassName, subName, teacherName, chapterId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(chapterId)) {
    return res.status(400).json({ error: "Invalid chapter ID format." });
  }

  try {
    const result = await Upload.findOneAndUpdate(
      { school, sclassName, subName, teacherName },
      { $pull: { videos: { _id: new mongoose.Types.ObjectId(chapterId) } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Video document not found" });
    }

    return res
      .status(200)
      .json({ status: "success", message: "Video deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  uploadVideo,
  getAllVideos,
  getVideo,
  editVideo,
  deleteVideo,
};
