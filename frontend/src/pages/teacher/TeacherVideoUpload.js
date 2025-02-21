import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../../components/Popup";

const TeacherVideoUpload = () => {
  const [videos, setVideos] = useState([{ chapter: "", videoUrl: "" }]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const teacherName = userState?.currentUser?._id || "";

  const isValidUrl = (url) => url.startsWith("http");

  const handleChange = (index, field) => (event) => {
    const newVideos = [...videos];
    newVideos[index][field] = event.target.value;
    setVideos(newVideos);
  };

  const handleAddVideo = () =>
    setVideos([...videos, { chapter: "", videoUrl: "" }]);

  const handleRemoveVideo = (index) => () => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoader(true);

    if (!teacherName) {
      setMessage("Missing required user data. Please log in again.");
      setShowPopup(true);
      setLoader(false);
      return;
    }

    for (let video of videos) {
      if (!video.chapter.trim()) {
        setMessage("Video title cannot be empty.");
        setShowPopup(true);
        setLoader(false);
        return;
      }
      if (!isValidUrl(video.videoUrl.trim())) {
        setMessage("Invalid video URL. Must start with http or https.");
        setShowPopup(true);
        setLoader(false);
        return;
      }
    }

    console.log("request to backend: ", ...videos, teacherName);

    try {
      for (let video of videos) {
        const response = await fetch("http://localhost:4000/teacher/video", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teacherName,
            chapter: video.chapter,
            videoUrl: video.videoUrl,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          setMessage(data.message || "Upload failed. Try again.");
          setShowPopup(true);
          setLoader(false);
          return;
        }
      }

      navigate("/Teacher/videos");
    } catch (error) {
      setMessage("Network Error. Please try again.");
      setShowPopup(true);
    }

    setLoader(false);
  };

  return (
    <form onSubmit={submitHandler}>
      <Box mb={2}>
        <Typography variant="h6">Upload Videos</Typography>
      </Box>
      <Grid container spacing={2}>
        {videos.map((video, index) => (
          <React.Fragment key={index}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Video Title"
                variant="outlined"
                value={video.chapter}
                onChange={handleChange(index, "chapter")}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Video URL"
                variant="outlined"
                value={video.videoUrl}
                onChange={handleChange(index, "videoUrl")}
                required
              />
            </Grid>
            <Grid item xs={12}>
              {index > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleRemoveVideo(index)}
                >
                  Remove
                </Button>
              )}
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <Button variant="outlined" onClick={handleAddVideo}>
            Add Another Video
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loader}
            >
              {loader ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Upload"
              )}
            </Button>
          </Box>
        </Grid>
        <Popup
          message={message}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      </Grid>
    </form>
  );
};

export default TeacherVideoUpload;
