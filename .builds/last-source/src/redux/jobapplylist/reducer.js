// redux/jobApplyList/reducer.js
import jobApplyListActions from "./actions";

const initialState = {
  jobApplyListLoader: false,
  jobApplyList: [],
  jobApplyListError: null,
};

const jobApplyListReducer = (state = initialState, action) => {
  switch (action.type) {
    case jobApplyListActions.SET_JOB_APPLY_LIST_LOADER:
      return {
        ...state,
        jobApplyListLoader: action.payload,
      };

    case jobApplyListActions.GET_JOB_APPLY_LIST_SUCCESS:
      // Normalise whatever comes from the saga into a plain array
      // to keep the UI logic simple and resilient to backend changes.
      let list = [];

      if (Array.isArray(action.payload)) {
        list = action.payload;
      } else if (Array.isArray(action.payload?.results)) {
        list = action.payload.results;
      } else if (Array.isArray(action.payload?.data?.results)) {
        list = action.payload.data.results;
      } else if (Array.isArray(action.payload?.data)) {
        list = action.payload.data;
      } else if (Array.isArray(action.payload?.applicants)) {
        list = action.payload.applicants;
      }

      return {
        ...state,
        jobApplyList: list,
        jobApplyListError: null,
      };

    case jobApplyListActions.GET_JOB_APPLY_LIST_FAILURE:
      return {
        ...state,
        jobApplyListError: action.payload,
      };

    case jobApplyListActions.RESET_JOB_APPLY_LIST_STATE:
      return {
        ...state,
        jobApplyListLoader: false,
        jobApplyList: [],
        jobApplyListError: null,
      };

    default:
      return state;
  }
};

export default jobApplyListReducer;
