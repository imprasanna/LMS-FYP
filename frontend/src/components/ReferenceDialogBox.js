import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

const AddReferenceBox = ({ open, onClose, onConfirm, setReference, reference }) => {
  const [localReference, setLocalReference] = useState(reference || []);

  // Handle changes in the reference array (edit individual URL)
  const handleReferenceChange = (index, value) => {
    const updatedReferences = [...localReference];
    updatedReferences[index] = value;
    setLocalReference(updatedReferences);
  };

  // Add a new empty reference field
  const handleAddNewField = () => {
    setLocalReference([...localReference, ""]);
  };

  // Handle saving the references when user confirms
  const handleConfirmChanges = () => {
    setReference(localReference);  // Update parent state
    onConfirm(localReference);  // Trigger confirmation logic passed via props
    onClose();  // Close the dialog
  };

  // Ensure that the localReference state syncs when the `reference` prop changes
  useEffect(() => {
    setLocalReference(reference || []);
  }, [reference]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit References</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Edit the references for the teacher. You can add, remove, or modify the URLs.
        </DialogContentText>

        {/* Render dynamically created input fields based on reference array */}
        {localReference.map((ref, index) => (
          <TextField
            key={index}
            label={`Reference ${index + 1}`}
            value={ref}
            onChange={(e) => handleReferenceChange(index, e.target.value)}
            fullWidth
            margin="normal"
          />
        ))}

        {/* Button to add a new empty reference field */}
        <Button onClick={handleAddNewField} color="primary">
          Add New Reference
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmChanges} color="primary" autoFocus>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReferenceBox;
