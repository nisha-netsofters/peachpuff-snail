import actions from "./actions";

const initialState = {
  results: [],
  total: 0,
  isSuccess: false,
  courseResults: [],
  courseTotal: 0,
  courseSuccess: false,
};

export const educationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_EDUCATIONS:
      return { ...state, ...action.payload };
    case actions.SET_COURSES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
