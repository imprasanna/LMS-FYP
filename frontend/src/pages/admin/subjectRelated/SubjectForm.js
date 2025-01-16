import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "../../../components/Popup";

const SubjectForm = () => {
  const [subjectName, setSubjectName] = useState("");
  const [subCode, setSubCode] = useState("");
  const [sessions, setSessions] = useState("");
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setSyllabusFile(file);
    } else {
      setMessage("Invalid file format. Please upload a PDF or DOC file.");
      setShowPopup(true);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!syllabusFile) {
      setMessage("Please upload a syllabus file.");
      setShowPopup(true);
      return;
    }

    const formData = new FormData();
    formData.append("subjectName", subjectName);
    formData.append("subCode", subCode);
    formData.append("sessions", sessions);
    formData.append("syllabusFile", syllabusFile);

    setLoader(true);

    try {
      const response = await fetch("http://localhost:4000/api/uploads/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "An error occurred during upload.");
      }

      const data = await response.json();
      setMessage("Subject added successfully!");

      navigate("/Admin/subjects");
    } catch (error) {
      setMessage(error.message || "Network error while uploading.");
    } finally {
      setLoader(false);
      setShowPopup(true);
    }
  };

  return (
    <form onSubmit={submitHandler} encType="multipart/form-data">
      <Box mb={2}>
        <Typography variant="h6">Add Subject</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Subject Name"
            variant="outlined"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Subject Code"
            variant="outlined"
            value={subCode}
            onChange={(e) => setSubCode(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Sessions"
            variant="outlined"
            type="number"
            inputProps={{ min: 0 }}
            value={sessions}
            onChange={(e) => setSessions(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" component="label">
            Upload Syllabus File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {syllabusFile && (
            <Typography variant="body2">
              Selected File: {syllabusFile.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Box mr={2}>
              {" "}
              {/* Add margin-right here */}
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loader}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save"
                )}
              </Button>
            </Box>
          </Box>
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

export default SubjectForm;
