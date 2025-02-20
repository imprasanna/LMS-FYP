import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVideos } from "../../redux/teacherRelated/teacherHandle";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const TeacherVideoList = ({ teacherID }) => {
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.teacher.videoList);
  const error = useSelector((state) => state.teacher.error);

  useEffect(() => {
    if (teacherID) {
      dispatch(getVideos(teacherID));
    }
  }, [dispatch, teacherID]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Subject Name</TableCell>
            <TableCell>Class Name</TableCell>
            <TableCell>Video Title</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={3} style={{ color: "red" }}>
                {error}
              </TableCell>
            </TableRow>
          ) : videos.length > 0 ? (
            videos.map((video, index) => (
              <TableRow key={index}>
                <TableCell>{video.subName || "N/A"}</TableCell>
                <TableCell>{video.sclassName || "N/A"}</TableCell>
                <TableCell>
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {video.chapter || "Untitled Video"}
                  </a>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No videos available.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TeacherVideoList;
