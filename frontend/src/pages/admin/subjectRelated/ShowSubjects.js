import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getSubjectList,
  deleteSubject,
} from "../../../redux/sclassRelated/sclassHandle";
import {
  Paper,
  IconButton,
  Box,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

const ShowSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectsList, loading, error } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser._id) {
      dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    setFilteredSubjects(
      subjectsList.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    );
  }, [subjectsList, page, rowsPerPage]);

  const deleteHandler = (id) => {
    dispatch(deleteSubject(id))
      .then(() => {
        setMessage("Subject deleted successfully.");
        setShowPopup(true);
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
      })
      .catch((err) => {
        setMessage("Failed to delete subject. Please try again.");
        setShowPopup(true);
        console.error(err);
      });
  };

  const openConfirmDialog = (id) => {
    setDeleteID(id);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setDeleteID(null);
  };

  const confirmDelete = () => {
    if (deleteID) {
      deleteHandler(deleteID);
    }
    closeConfirmDialog();
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handlePageChange = (direction) => {
    if (
      direction === "next" &&
      page < Math.ceil(subjectsList.length / rowsPerPage) - 1
    ) {
      setPage(page + 1);
    } else if (direction === "prev" && page > 0) {
      setPage(page - 1);
    }
  };

  const SubjectRow = ({ subject }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        margin: "5px 0",
        border: "1px solid #ddd",
        borderRadius: "4px",
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor: "#f1f1f1",
          cursor: "pointer",
        },
      }}
    >
      <span>{subject.subName}</span>
      <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            openConfirmDialog(subject.id);
          }}
          color="secondary"
        >
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            navigate(
              `/Admin/subjects/subject/${subject.sclassID}/${subject.id}`
            );
          }}
        >
          View
        </BlueButton>
      </Box>
    </Box>
  );

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
          {filteredSubjects.map((subject) => (
            <SubjectRow key={subject.id} subject={subject} />
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              displayEmpty
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
            </Select>
            <span>
              Page {page + 1} of {Math.ceil(subjectsList.length / rowsPerPage)}
            </span>
            <Box>
              <Button
                onClick={() => handlePageChange("prev")}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange("next")}
                disabled={
                  page >= Math.ceil(subjectsList.length / rowsPerPage) - 1
                }
              >
                Next
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
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
        message="Are you sure you want to delete this subject? This action cannot be undone."
      />
    </>
  );
};

export default ShowSubjects;
