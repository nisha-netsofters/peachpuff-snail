import agencyActions from "./actions";

const initialState = {
  isLoading: false,
  allAgency: [],
  agencyDetail: {},
  agencyCount: [],
  agencyDashboard: [],
  agencyDashboardTableData: [],
  clientsTransactions: [],
};

export const agencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case agencyActions.SET_AGENCY_STATE:
      state = action.payload;
      return state;
    case agencyActions.SET_AGENCY_COUNT:
      state.agencyCount = action.payload;
      return state;
    case agencyActions.SET_AGENCY_DASHBOARD:
      state.agencyDashboard = action.payload;
      return state;
    case agencyActions.SET_AGENCY_DASHBOARD_TABLE_DATA:
      state.agencyDashboardTableData = action.payload;
      return state;
    case agencyActions.SET_TRANSACTION:
      state.clientsTransactions = action.payload;
      return state;
    case agencyActions.SET_AGENCY_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};
