import jobsApplyActions from "./actions";

const initialState = {
  jobApplyLoader: false,
  jobApplyResponse: null,
  jobApplyError: null
};

const jobsApplyReducer = (state = initialState, action) => {
  switch (action.type) {
    case jobsApplyActions.SET_JOB_APPLY_LOADER:
      return {
        ...state,
        jobApplyLoader: action.payload
      };

    case jobsApplyActions.POST_JOB_APPLY_SUCCESS:
      return {
        ...state,
        jobApplyResponse: action.payload,
        jobApplyError: null
      };

    case jobsApplyActions.POST_JOB_APPLY_FAILURE:
      return {
        ...state,
        jobApplyError: action.payload,
        jobApplyResponse: null
      };

    case jobsApplyActions.RESET_JOB_APPLY_STATE:
      return {
        ...state,
        jobApplyLoader: false,
        jobApplyResponse: null,
        jobApplyError: null
      };

    default:
      return state;
  }
};

export default jobsApplyReducer;
