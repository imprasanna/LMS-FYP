import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subjectsList: [],
  subjectDetails: [],
  loading: false,
  subloading: false,
  error: null,
  response: null,
};

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSubDetailsRequest: (state) => {
      state.subloading = true;
    },
    getSubjectsSuccess: (state, action) => {
      state.subjectsList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getFailed: (state, action) => {
      state.subjectsList = [];
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getSubDetailsSuccess: (state, action) => {
      state.subjectDetails = action.payload;
      state.subloading = false;
      state.error = null;
    },
  },
});

export const {
  getRequest,
  getFailed,
  getError,
  getSubjectsSuccess,
  getSubDetailsRequest,
  getSubDetailsSuccess,
} = subjectSlice.actions;

export const subjectReducer = subjectSlice.reducer;