import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjectList } from "../../redux/subjectRelated/subjectHandle";
import { Paper } from "@mui/material";
import TableTemplate from "../../components/TableTemplate";

const ShowSubjects = () => {
  const dispatch = useDispatch();

  const { subjectsList, loading, error } = useSelector(
    (state) => state.subject
  );
  const { currentUser, currentRole } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentRole === "Teacher" && currentUser?._id) {
      dispatch(getSubjectList(currentUser._id, "TeacherSubjects"));
    }
  }, [currentRole, currentUser?._id, dispatch]);

  if (error) {
    console.error("Error fetching subjects:", error);
  }

  const subjectColumns = [
    { id: "subName", label: "Subject Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 170 },
    { id: "sclassName", label: "Class", minWidth: 170 },
  ];

  // Filter and map subjects for rows
  const subjectRows = Array.isArray(subjectsList)
    ? subjectsList
        .filter((subject) => subject.sclassName)
        .map((subject) => ({
          subName: subject.subName || "N/A",
          sessions: subject.sessions || 0,
          sclassName: subject.sclassName?.sclassName || "N/A",
          sclassID: subject.sclassName?._id || "",
          id: subject._id,
        }))
    : [];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {loading ? (
        <div>Loading...</div>
      ) : currentRole !== "Teacher" ? (
        <div>Unauthorized: Only teachers can view this section.</div>
      ) : (
        <TableTemplate
          columns={subjectColumns}
          rows={subjectRows}
          buttonHaver={() => <div>No actions available</div>}
        />
      )}
    </Paper>
  );
};

export default ShowSubjects;
