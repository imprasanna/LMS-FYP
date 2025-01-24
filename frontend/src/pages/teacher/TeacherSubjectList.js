import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjectList } from "../../redux/subjectRelated/subjectHandle";
import { Paper } from "@mui/material";
import TableTemplate from "../../components/TableTemplate";

const ShowSubjects = () => {
  const dispatch = useDispatch();
  const { subjectsList, loading, error } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getSubjectList(currentUser._id, "AllSubjects"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const subjectColumns = [
    { id: "subName", label: "Sub Name", minWidth: 170 },
    { id: "sessions", label: "Sessions", minWidth: 170 },
    { id: "sclassName", label: "Class", minWidth: 170 },
  ];

  const subjectRows = Array.isArray(subjectsList)
    ? subjectsList.map((subject) => ({
        subName: subject.subName || "N/A",
        sessions: subject.sessions || 0,
        sclassName: subject.sclassName?.sclassName || "N/A",
        id: subject._id,
      }))
    : [];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {Array.isArray(subjectsList) && subjectsList.length > 0 ? (
            <TableTemplate columns={subjectColumns} rows={subjectRows} />
          ) : (
            <div>No subjects available</div>
          )}
        </Paper>
      )}
    </>
  );
};

export default ShowSubjects;
