import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailedTwo,
  getError,
  getStudentsSuccess,
  detailsSuccess,
} from "./sclassSlice";

export const getAllSclasses = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/SclassList/${id}`
    );
    console.log("API Response:", result.data);
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getClassStudents = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Sclass/Students/${id}`
    );
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getStudentsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getClassDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data) {
      dispatch(detailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const deleteClass = (id) => async () => {
  try {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/Sclass/${id}`);
  } catch (error) {
    throw error;
  }
};
