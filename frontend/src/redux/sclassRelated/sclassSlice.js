import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sclassesList: [],
  sclassStudents: [],
  sclassDetails: [],
  loading: false,
  error: null,
  getresponse: null,
};

const sclassSlice = createSlice({
  name: "sclass",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.sclassesList = action.payload;
      state.loading = false;
      state.error = null;
      state.getresponse = null;
    },
    getStudentsSuccess: (state, action) => {
      state.sclassStudents = action.payload;
      state.loading = false;
      state.error = null;
      state.getresponse = null;
    },
    getFailedTwo: (state, action) => {
      state.sclassesList = [];
      state.sclassStudents = [];
      state.getresponse = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    detailsSuccess: (state, action) => {
      state.sclassDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailedTwo,
  getError,
  getStudentsSuccess,
  detailsSuccess,
} = sclassSlice.actions;

export const sclassReducer = sclassSlice.reducer;
