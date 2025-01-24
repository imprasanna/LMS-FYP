import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  postDone,
  doneSuccess,
  setSubjectList,
} from "./teacherSlice";

export const getAllTeachers = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Teachers/${id}`
    );

    if (result.data && result.data.message) {
      dispatch(getFailed(result.data.message));
    } else if (result.data) {
      dispatch(getSuccess(result.data));
    } else {
      dispatch(getFailed("No data received from server."));
    }
  } catch (error) {
    dispatch(
      getError(error.message || "An error occurred while fetching teachers.")
    );
  }
};

export const getTeacherDetails = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Teacher/${id}`
    );

    if (result.data) {
      dispatch(doneSuccess(result.data));
    } else {
      dispatch(getFailed("No teacher details found."));
    }
  } catch (error) {
    dispatch(
      getError(
        error.message || "An error occurred while fetching teacher details."
      )
    );
  }
};

export const getSubjectList = (teacherId) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/TeacherSubjects/${teacherId}`
    );

    if (result.data && result.data.subjects) {
      dispatch(setSubjectList(result.data.subjects));
    } else if (result.data && result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getFailed("No data received for subjects."));
    }
  } catch (error) {
    dispatch(
      getError(
        error.message || "An error occurred while fetching the subject list."
      )
    );
  }
};

export const updateTeachSubject =
  (teacherId, teachSubject) => async (dispatch) => {
    dispatch(getRequest());

    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/TeacherSubject`,
        { teacherId, teachSubject },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(postDone());
    } catch (error) {
      dispatch(
        getError(error.message || "Failed to update teaching subjects.")
      );
    }
  };

export const deleteTeacher = (id) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/Teacher/${id}`);
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
};
