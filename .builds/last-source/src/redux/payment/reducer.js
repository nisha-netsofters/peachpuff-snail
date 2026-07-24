import actions from "./actions";

const initialState = {
  selectedPlan: null,
  order: null,
  isOrderCaptured: false,
  isPaymentModalOpened: false,
  paymentDetail: null,
  isSuccessPayment: null,
  isError: null,
  isLoading: false,
  paymentstatus: null,
  paymentDetails: null,
};

export const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.PAYMENT_SET_STATE:
      return { ...state, ...action.payload };
    case actions.ClEAR_PAYMENT_STATE:
      return initialState;
    default:
      return state;
  }
};
