import actions from "./actions";


export const candidateReducer = (state = [], action) => {
  switch (action.type) {
    case actions.SET_CANDIDATE:
     return {...state,...action.payload};
    case actions.SET_SELECTED_FOR_EMAIL_CANDIDATE:
      return { ...state, selectedCandidates: action.payload, isSent: false };
    case actions.IS_SENT:
      return { ...state, isSent: action.payload, isNotSent: false };
    case actions.IS_NOT_SENT:
      return { ...state, isSent: false, isNotSent: true };
    case actions.PLAN_EXPIRE:
      return { ...state, isPlanExpire: true };
    case actions.CREATE_PUBLIC_CANDIDATE_POPUP:
      return { ...state, createPublicCandidatePopup: action.payload };
    case actions.CREATE_ERROR:
      return action.payload;
    case actions.GET_CLIENT_CANDIDATE_LOADER:
      return { ...state, getClientCandidateLoader: action.payload };
    case actions.GET_BEST_MATCHES_CANDIDATE_LOADER:
      return { ...state, getBestMatchesCandidateLoader: action.payload };
    case actions.GET_CANDIDATE_STATISTICS_LOADER:
      return { ...state, getCandidateStatisticsLoader: action.payload };
    case actions.GET_SAVED_CANDIDATE_LOADER:
      return { ...state, getSavedCandidateLoader: action.payload };
    case actions.GET_CANDIDATE_JOB_MATCHING_LOADER:
      return { ...state, getCandidateJobMatchingLoader: action.payload };
    case actions.GET_CANDIDATE_PROFILE_LOADER:
      return { ...state, getCandidateProfileLoader: action.payload };
    case actions.CREATE_RESUME_ENQUIRY_SUCCESS:
      return { ...state, createResumeEnquirySuccess: action.payload };
    case actions.CREATE_RESUME_ENQUIRY_ERROR:
      return { ...state, createResumeEnquiryError: action.payload };
    case actions.CREATE_RESUME_ENQUIRY_LOADING:
      return { ...state, createResumeEnquiryLoading: action.payload };
    case actions.SET_RESUME_ENQUIRY_STATUS:
        return { 
          ...state, 
          resumeEnquiryStatus: action.payload 
        };
    default:
      return state; 
  }
};
