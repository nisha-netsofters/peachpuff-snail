import actions from "./actions";

const initialState = {
  plans: null,
  currentPlan: null,
  isLoading: false,
  error: false,
  planbyid: null,
};

export const planReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_PLAN_STATE:
      return { ...state, ...action.payload };
    case actions.PLANS_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};
