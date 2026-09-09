import actions from "./actions";

const initialState = {
  results: [],
  total: 0,
};

export const jobSubCatReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_JOBSUBCAT:
      return action.payload || initialState;
    default:
      return state;
  }
};
