import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../../utils/apiFetch";
import TableWithActions from "../../components/TableWithActions";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import useSnackBarController from "../../components/useSnackBar";
import EditDialogBox from "../../components/EditDialogBox";  

function Result() {
  const { showErrorSnackbar, showSuccessSnackbar } = useSnackBarController();
  const { currentUser } = useSelector((state) => state.user);
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [classId, setClassId] = useState(currentUser.teachSclass?._id.toString());
  const [subjectId, setSubjectId] = useState(currentUser.teachSubject?._id.toString());
  const [useEffectDependency, setUseEffectDependency] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedDeleteRow, setSelectedDeleteRow] = useState(null);
  const [selectedEditRow, setSelectedEditRow] = useState(null);

  const onOpenDelete = () => {
    setOpenDelete(true);
  };

  const onOpenEdit = () => {
    setOpenEdit(true);
  };

  const onCloseEdit = () => {
    setOpenEdit(false);
  };

  const onCloseDelete = () => {
    setOpenDelete(false);
  };

  const refetchResults = () => {
    setUseEffectDependency((prev) => prev + 1);
  };

  const onDelete = (rollNum) => {
    onOpenDelete();
    setSelectedDeleteRow(rollNum);
  };

  const onEdit = (rollNum) => {
    const selectedRow = result.find((row) => row.rollNum === rollNum);
    onOpenEdit();
    setSelectedEditRow(selectedRow);  // Pass the full row data
  };

  const fetchAllResult = async (url, method, body) => {
    try {
      const response = await apiRequest(url, method, body);
      if (response.success) {
        const resultData = response.data.map((row, index) => {
          return {
            id: index + 1,
            ...row,
            grade: row.marks === null ? null : row.grade
          };
        });

        setResult(resultData);
      }
    } catch (error) {
      showErrorSnackbar(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchAllResult("http://localhost:4000/teacher/result", "POST", {
      classId: classId,
      subjectId: subjectId,
    });
  }, [classId, subjectId, useEffectDependency]);

  const columns = [
    { id: "id", label: "S.N", minWidth: 100, align: "center" },
    { id: "name", label: "Name", minWidth: 100, align: "center" },
    { id: "rollNum", label: "Roll Number", minWidth: 100, align: "center" },
    { id: "marks", label: "Marks", minWidth: 100, align: "center" },
    { id: "grade", label: "Grade", minWidth: 100, align: "center" },
  ];

  const handleEdit = async(updatedRow) => {
    // console.log("Updating row:", updatedRow);
    const res = await apiRequest(
      "http://localhost:4000/teacher/result/update",
      "POST",
      {
        rollNum: updatedRow.rollNum,
        subjectId: subjectId,
        classId: classId,
        marks: updatedRow.marks,
      }
    );

    if (res.success) {
      showSuccessSnackbar("Successfully updated result!");
      refetchResults();
    } else {
      showErrorSnackbar("Error updating result!");
    }
    onCloseEdit();
    refetchResults();
  };

  const handleDelete = async () => {

    const res = await apiRequest(
      "http://localhost:4000/teacher/result/delete",
      "POST",
      { rollNum: selectedDeleteRow, subjectId: subjectId, classId: classId }
    );
    if (res.success) {
      showSuccessSnackbar("Successfully deleted result!");
    } else {
      onCloseDelete();
      showErrorSnackbar("Error deleting result!");
    }
    onCloseDelete();
    refetchResults();
  };

  return (
    <div>
      <h1 sx={{ margin: 2 }}>Result</h1>
      <TableWithActions
        columns={columns}
        rows={result}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <ConfirmationDialog
        open={openDelete}
        onClose={onCloseDelete}
        onConfirm={handleDelete}
        title="Delete Result"
        message="Are you sure you want to delete this result?"
      />
      <EditDialogBox
        open={openEdit}
        onClose={onCloseEdit}
        onConfirm={handleEdit}
        setSelectedEditRow={setSelectedEditRow}  // Pass setSelectedEditRow
        studentData={selectedEditRow}
      />
    </div>
  );
}

export default Result;
