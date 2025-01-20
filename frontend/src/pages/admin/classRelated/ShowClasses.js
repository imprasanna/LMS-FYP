import { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Paper,
  Select,
  MenuItem as MuiMenuItem,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteClass,
  getAllSclasses,
} from "../../../redux/sclassRelated/sclassHandle";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import styled from "styled-components";
import Popup from "../../../components/Popup";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteID, setDeleteID] = useState(null);

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  useEffect(() => {
    setFilteredClasses(
      sclassesList.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    );
  }, [sclassesList, page, rowsPerPage]);

  const deleteHandler = (deleteID) => {
    dispatch(deleteClass(deleteID))
      .then(() => {
        setMessage("Class deleted successfully.");
        setShowPopup(true);
        dispatch(getAllSclasses(adminID, "Sclass"));
      })
      .catch((err) => {
        setMessage("Failed to delete class. Please try again.");
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
      page < Math.ceil(sclassesList.length / rowsPerPage) - 1
    ) {
      setPage(page + 1);
    } else if (direction === "prev" && page > 0) {
      setPage(page - 1);
    }
  };

  const SclassRow = ({ sclass }) => (
    <HoverableDiv
      onClick={() => navigate("/Admin/classes/class/" + sclass._id)}
    >
      <span>{sclass.sclassName}</span>
      <ButtonContainer>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            openConfirmDialog(sclass._id);
          }}
          color="secondary"
        >
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/Admin/classes/class/" + sclass._id);
          }}
        >
          View
        </BlueButton>
      </ButtonContainer>
    </HoverableDiv>
  );

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Paper
          elevation={3}
          style={{ padding: "20px", backgroundColor: "#fff" }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <GreenButton
              variant="contained"
              onClick={() => navigate("/Admin/addclass")}
            >
              Add Class
            </GreenButton>
          </Box>
          {filteredClasses.map((sclass) => (
            <SclassRow key={sclass._id} sclass={sclass} />
          ))}
          <div
            style={{
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
              <MuiMenuItem value={5}>5</MuiMenuItem>
              <MuiMenuItem value={10}>10</MuiMenuItem>
              <MuiMenuItem value={25}>25</MuiMenuItem>
            </Select>
            <span>
              Page {page + 1} of {Math.ceil(sclassesList.length / rowsPerPage)}
            </span>
            <div>
              <Button
                onClick={() => handlePageChange("prev")}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange("next")}
                disabled={
                  page >= Math.ceil(sclassesList.length / rowsPerPage) - 1
                }
              >
                Next
              </Button>
            </div>
          </div>
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
        message="Are you sure you want to delete this class? This action cannot be undone."
      />
    </>
  );
};

export default ShowClasses;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HoverableDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f1f1f1;
    cursor: pointer;
  }
`;
