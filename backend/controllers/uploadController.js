const Upload = require("../models/uploadSchema");
const mongoose = require("mongoose");

// Upload a new video or add to existing teacher's videos
const uploadVideo = async (req, res) => {
  const { teacherName, chapter, videoUrl } = req.body;

  if (!teacherName || !chapter || !videoUrl) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    let existingVideo = await Upload.findOne({ teacherName });

    if (existingVideo) {
      const chapterExists = existingVideo.videos.some(
        (video) => video.chapter === chapter
      );
      if (chapterExists) {
        return res.status(400).json({ error: "This chapter already exists." });
      }
      existingVideo.videos.push({ chapter, videoUrl });
      await existingVideo.save();
      return res.status(200).json({ message: "Video added successfully." });
    }

    const newVideo = new Upload({
      teacherName,
      videos: [{ chapter, videoUrl }],
    });

    await newVideo.save();
    return res.status(201).json({ message: "Video uploaded successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch all videos for a teacher
const getAllVideos = async (req, res) => {
  const { teacherName } = req.query;

  if (!teacherName) {
    return res.status(400).json({ error: "Missing teacherName." });
  }

  try {
    const existingVideo = await Upload.findOne({ teacherName });
    if (!existingVideo || existingVideo.videos.length === 0) {
      return res.status(404).json({ error: "No videos found." });
    }
    return res.status(200).json({ videos: existingVideo.videos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch a single video by chapter ID
const getVideo = async (req, res) => {
  const { teacherName, chapterId } = req.query;

  if (!teacherName || !chapterId) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const existingVideo = await Upload.findOne({ teacherName });
    if (!existingVideo) {
      return res.status(404).json({ error: "Teacher not found." });
    }
    const video = existingVideo.videos.find(
      (v) => v._id.toString() === chapterId
    );
    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }
    return res.status(200).json({ video });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Edit video details
const editVideo = async (req, res) => {
  const { teacherName, chapterId, chapter, videoUrl } = req.body;

  if (!teacherName || !chapterId || !chapter || !videoUrl) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const existingVideo = await Upload.findOne({ teacherName });
    if (!existingVideo) {
      return res.status(404).json({ error: "Teacher not found." });
    }
    const video = existingVideo.videos.find(
      (v) => v._id.toString() === chapterId
    );
    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }
    video.chapter = chapter;
    video.videoUrl = videoUrl;
    await existingVideo.save();
    return res.status(200).json({ message: "Video updated successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a video
const deleteVideo = async (req, res) => {
  const { teacherName, chapterId } = req.query;

  if (
    !teacherName ||
    !chapterId ||
    !mongoose.Types.ObjectId.isValid(chapterId)
  ) {
    return res.status(400).json({ error: "Invalid or missing parameters." });
  }

  try {
    const result = await Upload.findOneAndUpdate(
      { teacherName },
      { $pull: { videos: { _id: chapterId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Video document not found." });
    }
    return res.status(200).json({ message: "Video deleted successfully." });
  } catch (err) {
    console.error(err);
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
