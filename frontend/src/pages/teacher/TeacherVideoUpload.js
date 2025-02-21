import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addVideo } from "../../redux/teacherRelated/teacherHandle";
import Popup from "../../components/Popup";

const TeacherVideoUpload = () => {
  const [videos, setVideos] = useState([{ chapter: "", videoUrl: "" }]);
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const { userInfo } = userState;

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  console.log("User Info State:", userInfo);

  const school = userInfo?.school?._id || "";
  const sclassName = userInfo?.sclassName?._id || "";
  const subName = userInfo?.subName?._id || "";
  const teacherName = userInfo?.teacherId?._id || "";

  const isValidUrl = (url) => url.startsWith("http");

  const handleChange = (index, field) => (event) => {
    const newVideos = [...videos];
    newVideos[index][field] = event.target.value;
    setVideos(newVideos);
  };

  const handleAddVideo = () =>
    setVideos([...videos, { chapter: "", videoUrl: "" }]);

  const handleRemoveVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);

    // Ensure userInfo is available
    if (!userInfo) {
      setMessage("User information is not available.");
      setShowPopup(true);
      setLoader(false);
      return;
    }

    // Ensure all required user info fields are populated
    const school = userInfo?.school?._id || "";
    const sclassName = userInfo?.sclassName?._id || "";
    const subName = userInfo?.subName?._id || "";
    const teacherName = userInfo?.teacherId?._id || "";

    if (!school || !sclassName || !subName || !teacherName) {
      setMessage("One or more required fields are missing in your user info.");
      setShowPopup(true);
      setLoader(false);
      return;
    }

    // Validate videos data
    for (let video of videos) {
      if (!video.chapter.trim()) {
        setMessage("Chapter name cannot be empty.");
        setShowPopup(true);
        setLoader(false);
        return;
      }
      if (!isValidUrl(video.videoUrl)) {
        setMessage("Invalid video URL. Must start with http or https.");
        setShowPopup(true);
        setLoader(false);
        return;
      }
    }

    // Construct the request body
    const requestBody = { school, sclassName, subName, teacherName, videos };

    console.log("Sending request body:", requestBody); // <-- Debugging line

    // Dispatch the action to upload videos
    dispatch(addVideo(requestBody))
      .then(() => {
        // Handle success (if needed)
      })
      .catch((error) => {
        // Handle error (if needed)
        setMessage(
          error.message || "An error occurred during the video upload."
        );
        setShowPopup(true);
      })
      .finally(() => {
        setLoader(false);
      });
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
                label="Chapter Name"
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
                  onClick={() => handleRemoveVideo(index)}
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loader}
          >
            {loader ? <CircularProgress size={24} color="inherit" /> : "Upload"}
          </Button>
        </Grid>
      </Grid>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </form>
  );
};

export default TeacherVideoUpload;
