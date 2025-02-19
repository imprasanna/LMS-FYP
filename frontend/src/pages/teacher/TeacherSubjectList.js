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
      console.log("Fetching subjects for teacher:", currentUser._id);
      dispatch(getSubjectList(currentUser._id, "TeacherSubject"));
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

  console.log("Subjects List from Redux:", subjectsList);

  // Ensure subjectsList is always an array
  const formattedSubjects = Array.isArray(subjectsList)
    ? subjectsList
    : subjectsList && typeof subjectsList === "object"
    ? [subjectsList] // Convert single object to an array
    : [];

  const subjectRows = formattedSubjects.map((subject) => ({
    subName: subject.subName || "N/A",
    sessions: subject.sessions || 0,
    sclassName:
      typeof subject.sclassName === "object"
        ? subject.sclassName.sclassName
        : String(subject.sclassName) || "N/A",
    sclassID:
      typeof subject.sclassName === "object"
        ? subject.sclassName._id
        : String(subject.sclassName) || "",
    id: subject._id,
  }));

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      {loading ? (
        <div>Loading...</div>
      ) : currentRole !== "Teacher" ? (
        <div>Unauthorized: Only teachers can view this section.</div>
      ) : subjectRows.length === 0 ? (
        <div>No subjects found.</div>
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
