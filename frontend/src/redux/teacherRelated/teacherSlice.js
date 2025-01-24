import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSubjectList } from "../../../redux/teacherRelated/teacherHandle";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton } from "../../../components/buttonStyles";
import { Paper } from "@mui/material";

const TeacherSubjectList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectsList, loading, error } = useSelector(
    (state) => state.teacher
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch the list of subjects assigned to the currently logged-in teacher
    dispatch(getSubjectList(currentUser._id));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.error(error);
  }

  const subjectColumns = [
    { id: "subName", label: "Subject Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 170 },
    { id: "action", label: "Action", minWidth: 170 },
  ];

  const subjectRows = Array.isArray(subjectsList)
    ? subjectsList.map((subject) => ({
        subName: subject.subName || "N/A",
        sessions: subject.sessions || 0,
        id: subject._id,
      }))
    : [];

  const SubjectsButtonHaver = ({ row }) => (
    <BlueButton
      variant="contained"
      onClick={() => navigate(`/Teacher/subject/chapter/${row.id}`)}
    >
      View
    </BlueButton>
  );

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {Array.isArray(subjectsList) && subjectsList.length > 0 && (
            <TableTemplate
              buttonHaver={SubjectsButtonHaver}
              columns={subjectColumns}
              rows={subjectRows}
            />
          )}
        </Paper>
      )}
    </>
  );
};

export default TeacherSubjectList;
