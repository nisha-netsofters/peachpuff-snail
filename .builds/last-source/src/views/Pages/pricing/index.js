import { useEffect, Fragment } from "react";
import PricingCards from "./PricingCards";
// import useRazorpay from "react-razorpay";
import "@styles/base/pages/page-pricing.scss";
import { useDispatch, useSelector } from "react-redux";
import planActions from "../../../redux/plan/actions";
import paymentActions from "./../../../redux/payment/actions";
import Loader from "./../../../components/Dialog/Loader";
// import unique from "../../../assets/images/logo/unique.png";
import { Button } from "reactstrap";
// import authActions from "../../../redux/auth/actions";
import userActions from "../../../redux/user/actions";

const Pricing = () => {
  const { plans } = useSelector((state) => state.plans);
  
  console.log('---------------------');
  console.log('plans =>', plans);
  console.log('---------------------');
  const { user } = useSelector((state) => state.auth);
  const { currentPlan } = useSelector((state) => state.subscription);
  // const [Razorpay] = useRazorpay();
  const dispatch = useDispatch();
  const {
    isLoading,
    isOrderCaptured,
    isPaymentModalOpened,
    order,
    isSuccessPayment,
    // selectedPlan,
  } = useSelector((state) => state.payment);

  useEffect(() => {
    if (user?.clients?.id) {
      dispatch({
        type: userActions.GET_LOGIN_USER_DETAIL,
        payload: user?.id,
      });
    }
  }, []);

  useEffect(() => {
    if (order !== null && isOrderCaptured && isPaymentModalOpened == false) {
      createPayment();
    }
  }, [order, isOrderCaptured, isPaymentModalOpened]);

  useEffect(() => {
    dispatch({
      type: planActions.GET_ALL_PLANS,
    });
  }, []);
  useEffect(() => {
    if (isSuccessPayment == true) {
      dispatch({
        type: paymentActions.ClEAR_PAYMENT_STATE,
      });
    }
  }, [isSuccessPayment]);
  const createPayment = async () => {
    if (order !== null && isOrderCaptured) {
      dispatch({
        type: paymentActions.PAYMENT_SET_STATE,
        payload: {
          isPaymentModalOpened: true,
        },
      });

      // const rzp1 = new Razorpay({
      //   key: process.env.REACT_APP_RAZOR_PAY_KEY_ID,
      //   currency: "INR",
      //   amount: order?.amount,
      //   name: "Unique World CRM",
      //   description: "Test Wallet Transaction",
      //   image: unique,
      //   order_id: order?.id,
      //   handler: function (response) {
      //     if (response?.razorpay_payment_id) {
      //       dispatch({
      //         type: userActions.GET_LOGIN_USER_DETAIL,
      //         payload: user?.id,
      //       });
      //       dispatch({
      //         type: paymentActions?.PAYMENT_SUCCESSFUL_MAIL,
      //         payload: { id: user?.clients?.id },
      //       });
      //     } else {
      //       tostifyError("Something went wrong..");
      //     }
      //   },
      //   prefill: {
      //     name: "card holder name",
      //     email: "youremail@example.com",
      //     contact: "9586730534",
      //   },
      //   modal: {
      //     confirm_close: true,
      //   },
      //   description: "Test Transaction",
      //   theme: {
      //     color: "#323D76",
      //   },
      //   notes: {
      //     planId: selectedPlan?.id,
      //     userId: user?.id,
      //   },
      // });
      // rzp1.open();
    }
  };

  const createOrderInstance = async (plan) => {
    const options = {
      // notes: {
      //   planId: plan?.id,
      // },
      notes: {
        customerId: user?.clients?.razorpay_custId,
        userId: user?.id,
        clientId: user?.clients?.id,
      },
      amount: Number(plan?.price) * 100,
      currency: "INR",
      receipt: "receipt#1",
      // payment_capture: 0,
    };
    dispatch({
      type: paymentActions.CREATE_ORDER_INSTANCE,
      payload: { options, selectedPlan: plan },
    });
  };
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  return (
    <div id="pricing-table">
      <Loader loading={isLoading} />
      <div className="text-center">
        <h1 className="mt-2 mb-2 " style={{ color: themecolor }}>
          Pricing Plans
        </h1>
      </div>
      <PricingCards
        createOrderInstance={createOrderInstance}
        data={plans !== null ? plans : []}
        plan_feature_id={currentPlan?.plan_feature_id}
        planId={currentPlan?.id}
      />
    </div>
  );
};

export default Pricing;
