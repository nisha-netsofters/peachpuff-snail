import jobOpeningMatchesActions from "./actions"

const initialState = {
    isLoading: false,
    jobOpeningRow: {},
    jobOpeningMatchCandidate: {}
}

export const jobOpeningMatchesReducer = (state = initialState, action) => {
    switch (action.type) {
        case jobOpeningMatchesActions.SET_JOB_MATCHES_STATE:
          return {...state,...action.payload};
        case jobOpeningMatchesActions.JOB_MATCHES_LOADER:
            return { ...state, isLoading: action.payload };
        default:
          return state;
      }
}