import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  postDone,
  doneSuccess,
  setSubjectList,
  setCourseList,
  setVideoList, // Added for handling video list
} from "./teacherSlice";

// Fetch uploaded videos
export const getVideos = (teacherID) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/TeacherVideos/${teacherID}`
    );

    // Ensure the response is valid
    if (
      result.status === 200 &&
      result.data &&
      Array.isArray(result.data.videos)
    ) {
      dispatch(setVideoList(result.data.videos));
    } else {
      dispatch(
        getFailed(result.data.message || "Invalid response or no videos found.")
      );
    }
  } catch (error) {
    let errorMessage = "An error occurred while fetching videos.";

    if (error.response) {
      errorMessage = `Error ${error.response.status}: ${
        error.response.data?.message || "Server error"
      }`;
    } else if (error.request) {
      errorMessage =
        "No response from the server. Please check your connection.";
    } else {
      errorMessage = error.message;
    }

    dispatch(getError(errorMessage));
  }
};

// Upload videos
export const addVideo = (videoData) => async (dispatch, getState) => {
  dispatch(getRequest());

  const { currentUser } = getState().user; // Assuming user state is in Redux under "user"

  // Ensure user info is available and complete
  if (
    !currentUser ||
    !currentUser.school ||
    !currentUser.sclassName ||
    !currentUser.subName ||
    !currentUser.teacherId
  ) {
    dispatch(getFailed("User info is incomplete or missing required fields."));
    return;
  }

  const school = currentUser.school._id;
  const sclassName = currentUser.sclassName._id;
  const subName = currentUser.subName._id;
  const teacherName = currentUser.teacherId._id;

  const requestBody = {
    school,
    sclassName,
    subName,
    teacherName,
    ...videoData,
  };

  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/teacher/video`,
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );

    if (result.data && result.data.success) {
      // Video upload successful, reset state and refetch videos if needed
      dispatch(postDone());
      dispatch(getVideos(currentUser.teacherId._id)); // Re-fetch video list if necessary
    } else {
      dispatch(getFailed(result.data.message || "Failed to upload video."));
    }
  } catch (error) {
    dispatch(
      getError(error.message || "An error occurred while uploading the video.")
    );
  }
};

// Existing functions for courses and teachers remain unchanged

export const getCourses = (teacherID) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/TeacherCourses/${teacherID}`
    );

    if (result.data && result.data.courses) {
      dispatch(setCourseList(result.data.courses));
    } else {
      dispatch(getFailed("No course data received from server."));
    }
  } catch (error) {
    dispatch(
      getError(error.message || "An error occurred while fetching courses.")
    );
  }
};

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
