// Updated SubjectForm.js
import React, { useState } from "react";
import { Button, TextField, Grid, Box, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";

const SubjectForm = () => {
    const [subjectName, setSubjectName] = useState("");
    const [sessions, setSessions] = useState("");
    const [syllabusFile, setSyllabusFile] = useState(null);
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const dispatch = useDispatch();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
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
        formData.append("sessions", sessions);
        formData.append("syllabusFile", syllabusFile);

        setLoader(true);
        try {
            await dispatch(addStuff(formData, "Subject"));
            setLoader(false);
            setMessage("Subject added successfully!");
            setShowPopup(true);
        } catch (error) {
            setLoader(false);
            setMessage("An error occurred while saving the subject.");
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
                    {syllabusFile && <Typography variant="body2">Selected File: {syllabusFile.name}</Typography>}
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" type="submit" disabled={loader}>
                            {loader ? <CircularProgress size={24} color="inherit" /> : "Save"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </form>
    );
};

export default SubjectForm;
