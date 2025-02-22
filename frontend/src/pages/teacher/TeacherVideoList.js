import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Paper } from "@mui/material";
import TableTemplate from "../../components/TableTemplate";

const TeacherVideoList = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useSelector((state) => state.user);
  const teacherName = currentUser?._id;

  useEffect(() => {
    if (teacherName) {
      axios
        .get("http://localhost:4000/teacher/video/all", {
          params: { teacherName },
        })
        .then((response) => {
          setVideos(Array.isArray(response.data) ? response.data : []);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch videos");
          setVideos([]); // Ensure videos is an array even on error
          setLoading(false);
        });
    }
  }, [teacherName]);

  const videoColumns = [
    { id: "subName", label: "Subject Name", minWidth: 170 },
    { id: "sclassName", label: "Class Name", minWidth: 170 },
    {
      id: "chapter",
      label: "Video Title",
      minWidth: 170,
      format: (value, row) => (
        <a href={row.videoUrl} target="_blank" rel="noopener noreferrer">
          {value || "Untitled Video"}
        </a>
      ),
    },
  ];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : videos.length === 0 ? (
        <div>No videos available.</div>
      ) : (
        <TableTemplate
          columns={videoColumns}
          rows={videos}
          buttonHaver={() => <div>No actions available</div>}
        />
      )}
    </Paper>
  );
};

export default TeacherVideoList;
