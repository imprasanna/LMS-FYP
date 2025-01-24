import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teachersList: [],
  teacherDetails: [],
  subjectList: [], // New state for subjects
  loading: false,
  error: null,
  response: null,
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    doneSuccess: (state, action) => {
      state.teacherDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    getSuccess: (state, action) => {
      state.teachersList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    setSubjectList: (state, action) => {
      state.subjectList = action.payload; // Handle subject list updates
      state.loading = false;
      state.error = null;
    },
    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    postDone: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  doneSuccess,
  postDone,
  setSubjectList, // Export the new action
} = teacherSlice.actions;

export const teacherReducer = teacherSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   teachersList: [],
//   subjectList: [],
//   teacherDetails: [],
//   loading: false,
//   error: null,
//   response: null,
// };

// const teacherSlice = createSlice({
//   name: "teacher",
//   initialState,
//   reducers: {
//     getRequest: (state) => {
//       state.loading = true;
//     },
//     doneSuccess: (state, action) => {
//       state.teacherDetails = action.payload;
//       state.loading = false;
//       state.error = null;
//       state.response = null;
//     },
//     getSuccess: (state, action) => {
//       state.teachersList = action.payload;
//       state.loading = false;
//       state.error = null;
//       state.response = null;
//     },
//     getFailed: (state, action) => {
//       state.response = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     getError: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },
//     postDone: (state) => {
//       state.loading = false;
//       state.error = null;
//       state.response = null;
//     },
//     setSubjectList: (state, action) => {
//       state.subjectList = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//   },
// });

// export const {
//   getRequest,
//   getSuccess,
//   getFailed,
//   getError,
//   doneSuccess,
//   postDone,
//   setSubjectList,
// } = teacherSlice.actions;

// export const teacherReducer = teacherSlice.reducer;
