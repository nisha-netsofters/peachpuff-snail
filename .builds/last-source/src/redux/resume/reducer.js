import actions from "./action";

const initialState = {
  resumeList: {
    results: [],
    page: 1,
    perPage: 10,
    totalPages: 1,
    total: 0,
  },
  isLoading: false,
  updatingStatus: false,
  error: null,
};

export const resumeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.POST_RESUME_LIST_LOADER:
      return { ...state, isLoading: action.payload };

    case actions.SET_RESUME_LIST:
      return {
        ...state,
        resumeList: action.payload,
        isLoading: false,
        error: null,
      };

    // 🔹 status update flags
    case actions.UPDATE_RESUME_STATUS_LOADER:
      return {
        ...state,
        updatingStatus: action.payload,
      };

    case actions.UPDATE_RESUME_STATUS_SUCCESS: {
      const { id, status } = action.payload;
      const newResults = (state.resumeList.results || []).map((item) => {
        const itemId = item.id || item._id;
        if (itemId !== id) return item;
        return {
          ...item,
          status: status.toLowerCase(), // store lowercase
        };
      });

      return {
        ...state,
        resumeList: {
          ...state.resumeList,
          results: newResults,
        },
      };
    }

    default:
      return state;
  }
};

export default resumeReducer;
