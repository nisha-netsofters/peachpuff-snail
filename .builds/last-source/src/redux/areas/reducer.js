import actions from "./actions";

const initialState = {
  results: [],
  total: 0,
  isSuccess: false,
};

export const areasReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_AREAS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
