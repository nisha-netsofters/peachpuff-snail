import actions from "./actions";

const initialState = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  modal: true,
  isLoading: false,
  isOpenInactivePopup: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_STATE:
      return action.payload;
    case actions.SET_AUTH_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};
