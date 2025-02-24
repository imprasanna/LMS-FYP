import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Paper,
  Box,
  CircularProgress,
  IconButton,
  Button,
  Dialog,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TableTemplate from "../../components/TableTemplate";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import Popup from "../../components/Popup";
import ConfirmationDialog from "../../components/ConfirmationDialog";

const TeacherVideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [openVideoDialog, setOpenVideoDialog] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const teacherName = currentUser?._id;

  useEffect(() => {
    if (teacherName) {
      const fetchData = async () => {
        setLoader(true);
        try {
          const response = await axios.post(
            "http://localhost:4000/teacher/video/all",
            { teacherName }
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
  }, [teacherName]);

  const openConfirmDialog = (id) => {
    setDeleteID(id);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setDeleteID(null);
  };

  const deleteHandler = async (id) => {
    try {
      setMessage("Video deleted successfully.");
      setVideos(videos.filter((video) => video._id !== id));
    } catch (err) {
      setMessage("Failed to delete video. Please try again.");
    } finally {
      setShowPopup(true);
    }
  };

  const confirmDelete = () => {
    if (deleteID) {
      deleteHandler(deleteID);
    }
    closeConfirmDialog();
  };

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
    title: (
      <span
        onClick={() => handleVideoClick(video.videoUrl)}
        style={{
          textDecoration: "underline",
          color: "blue",
          cursor: "pointer",
        }}
      >
        {video.chapter || "Untitled Video"}
      </span>
    ),
    id: video._id,
  }));

  const VideoButtonHaver = ({ row }) => (
    <>
      <IconButton onClick={() => navigate(`/Teacher/edit/${row.id}`)}>
        <MdModeEdit color="primary" />
      </IconButton>
      <IconButton onClick={() => openConfirmDialog(row.id)}>
        <DeleteIcon color="error" />
      </IconButton>
    </>
  );

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

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#1f1f38", color: "white" }}
          onClick={() => navigate("/Teacher/upload")}
        >
          Add Videos
        </Button>
      </Box>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this video? This action cannot be undone."
      />

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
