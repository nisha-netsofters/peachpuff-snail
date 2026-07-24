import actions from "./actions";

const initialState = {
  currentSubscription: null,
  currentPlan: null,
  isLoading: false,
  error: false,
  resumeCountFinishError : false
};

export const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_SUBSCRIPTION_STATE:
      return { ...state, ...action.payload };
    case actions.SET_SUBSCRIPTION_LODING:
      return { ...state, isLoading: action.payload };
    case actions.RESUME_COUNT_FINISH:
      return { ...state, resumeCountFinishError: action.payload };
    default:
      return state;
  }
};
