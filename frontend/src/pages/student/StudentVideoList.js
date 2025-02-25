import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Paper, Box, CircularProgress, Button, Dialog } from "@mui/material";
import TableTemplate from "../../components/TableTemplate";

const TeacherVideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loader, setLoader] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [openVideoDialog, setOpenVideoDialog] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const user = currentUser._id;

  console.log("user: ", currentUser);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoader(true);
        try {
          const response = await axios.post(
            "http://localhost:4000/video/subject",
            { user }
          );
          setVideos(response.data.videos || []);
        } catch (error) {
          console.error("Failed to fetch videos.", error);
        } finally {
          setLoader(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleVideoClick = (url) => {
    setVideoUrl(url);
    setOpenVideoDialog(true);
  };

  const closeVideoDialog = () => {
    setOpenVideoDialog(false);
    setVideoUrl("");
  };

  const videoColumns = [{ id: "title", label: "Video Title", minWidth: 170 }];

  const videoRows = videos.map((video) => ({
    title: video.chapter || "Untitled Video",
    id: video._id,
  }));

  const VideoButtonHaver = ({ row }) => {
    const video = videos.find((v) => v._id === row.id);
    return (
      <Button
        variant="contained"
        sx={{ backgroundColor: "#1f1f38", color: "white" }}
        onClick={() => handleVideoClick(video.videoUrl)}
      >
        Watch
      </Button>
    );
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      {loader ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : videos.length === 0 ? (
        <div>No videos available.</div>
      ) : (
        <TableTemplate
          buttonHaver={VideoButtonHaver}
          columns={videoColumns}
          rows={videoRows}
        />
      )}

      <Dialog
        open={openVideoDialog}
        onClose={closeVideoDialog}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ position: "relative", padding: 2 }}>
          <iframe
            width="100%"
            height="500px"
            src={videoUrl}
            title="Video Preview"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </Box>
      </Dialog>
    </Paper>
  );
};

export default TeacherVideoList;
