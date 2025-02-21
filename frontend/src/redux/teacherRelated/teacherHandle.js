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
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/teacher/video/all`,
      { teacherID }
    );

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

  const { currentUser } = getState().user;

  if (!currentUser.teacherId) {
    dispatch(getFailed("User info is incomplete or missing required fields."));
    return;
  }

  const teacherName = currentUser.teacherId._id;

  const requestBody = {
    teacherName,
    ...videoData,
  };

  console.log("REQUEST BODY", requestBody);

  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/teacher/video`,
      requestBody
    );

    if (result.data && result.data.success) {
      dispatch(postDone());
      dispatch(getVideos(currentUser.teacherId._id));
    } else {
      dispatch(getFailed(result.data.message || "Failed to upload video."));
    }
  } catch (error) {
    dispatch(
      getError(error.message || "An error occurred while uploading the video.")
    );
  }
};

export const editVideo = (videoData) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/teacher/video`,
      videoData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (result.data && result.data.success) {
      dispatch(postDone());
    } else {
      dispatch(getFailed(result.data.message || "Failed to edit video."));
    }
  } catch (error) {
    dispatch(
      getError(error.message || "An error occurred while editing video.")
    );
  }
};

export const deleteVideo = (videoId) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/teacher/video/delete`,
      { videoId }
    );

    if (result.data && result.data.success) {
      dispatch(postDone());
    } else {
      dispatch(getFailed(result.data.message || "Failed to delete video."));
    }
  } catch (error) {
    dispatch(
      getError(error.message || "An error occurred while deleting video.")
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
