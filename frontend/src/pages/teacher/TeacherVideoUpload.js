import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../redux/userRelated/userHandle";
import Popup from "../../components/Popup";

const TeacherVideoUpload = () => {
  const [videos, setVideos] = useState([{ chapter: "", videoUrl: "" }]);
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const { userInfo, status, error } = userState;

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  // Extract ObjectId values correctly
  const school = userInfo?.school?._id || "";
  const sclassName = userInfo?.sclassName?._id || "";
  const subName = userInfo?.subName?._id || "";
  const teacherName = userInfo?.teacherId?._id || "";

  // Validate ObjectId format
  const isValidObjectId = (id) =>
    typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

  // Validate URL
  const isValidUrl = (url) =>
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
      url
    );

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

    // Validate required fields
    if (
      !isValidObjectId(school) ||
      !isValidObjectId(sclassName) ||
      !isValidObjectId(subName) ||
      !isValidObjectId(teacherName)
    ) {
      setMessage("Invalid data! Please check your inputs and try again.");
      setShowPopup(true);
      setLoader(false);
      return;
    }

    // Validate video data
    for (let video of videos) {
      if (!video.chapter.trim()) {
        setMessage("Chapter name cannot be empty.");
        setShowPopup(true);
        setLoader(false);
        return;
      }
      if (!isValidUrl(video.videoUrl)) {
        setMessage("Invalid video URL.");
        setShowPopup(true);
        setLoader(false);
        return;
      }
    }

    const requestBody = { school, sclassName, subName, teacherName, videos };
    dispatch(addStuff(requestBody, "teacher/video"));
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
