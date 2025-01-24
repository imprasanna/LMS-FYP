const Upload = require("../models/uploadSchema");
const mongoose = require("mongoose");

const uploadVideo = async (req, res) => {
    const { school, sclassName, subName, teacherName, chapter, videoUrl } = req.body;

    try {
        // Check if a document with the same school, sclassName, subName, and teacherName exists
        let existingVideo = await Upload.findOne({ school, sclassName, subName, teacherName });

        if (existingVideo) {
            // Check if the chapter already exists
            const chapterExists = existingVideo.videos.some(video => video.chapter === chapter);
            
            if (chapterExists) {
                return res.status(400).json({ error: "This chapter already exists." });
            }

            // If chapter does not exist, push new video details
            existingVideo.videos.push({ chapter, videoUrl });
            await existingVideo.save();
            return res.status(200).json({ message: "Video added successfully to the existing subject." });
        }

        // If no existing document, create a new one
        const newVideo = new Upload({
            school,
            sclassName,
            subName,
            teacherName,
            videos: [{ chapter, videoUrl }]
        });

        await newVideo.save();
        return res.status(201).json({ message: "Video uploaded successfully." });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const getAllVideos = async (req, res) => {
    const { school, sclassName, subName, teacherName } = req.body;

    try {
        const existingVideo = await Upload.findOne({ school, sclassName, subName, teacherName });
        return res.status(200).json({status: "success", message: "Fetched successfully", videos: existingVideo.videos });
}catch(err){
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
}
}

const getVideo = async (req, res) => {
    const { school, sclassName, subName, teacherName, chapterId } = req.body;

    try {
        const existingVideo = await Upload.findOne({school, sclassName, subName, teacherName});
        if(!existingVideo){
            return res.status(404).json({error: "Video not found"});
        }
        const video = existingVideo.videos.find(video =>{
           return video._id.toString() === chapterId
        } );
        if(!video){
            return res.status(404).json({error: "Video not found"});
        }
        return res.status(200).json({status: "success", message: "Fetched successfully", video: video });
}catch(err){
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
}
}

const editVideo = async (req, res) => {
    const { school, sclassName, subName, teacherName, chapterId, chapter, videoUrl } = req.body;

    try {
        const existingVideo = await Upload.findOne({school, sclassName, subName, teacherName});
        if(!existingVideo){
            return res.status(404).json({error: "Video not found"});
        }
        const video = existingVideo.videos.find(video =>{
           return video._id.toString() === chapterId
        } );
        if(!video){
            return res.status(404).json({error: "Video not found"});
        }
        video.chapter = chapter;
        video.videoUrl = videoUrl;
        await existingVideo.save();
        return res.status(200).json({status: "success", message: "Video updated successfully"});
}
catch(err){
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
}
}


const deleteVideo = async (req, res) => {
    const { school, sclassName, subName, teacherName, chapterId } = req.body;

    // Validate if chapterId is a valid ObjectId
    if (!chapterId || !mongoose.Types.ObjectId.isValid(String(chapterId))) {
        return res.status(400).json({ error: "Invalid chapterId format. Must be a valid ObjectId." });
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

        return res.status(200).json({ status: "success", message: "Video deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = { uploadVideo, getAllVideos, getVideo, editVideo, deleteVideo };