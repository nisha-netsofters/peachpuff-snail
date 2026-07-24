import { Fragment } from "react";
import PricingCards from "./PricingCards";
// import useRazorpay from "react-razorpay";
import "@styles/base/pages/page-pricing.scss";
import { useSelector } from "react-redux";
import logo from "../../../../assets/images/logo/unique-logo.png";

const Pricing = () => {
  const { currentPlan } = useSelector((state) => state.subscription);
  const plandata = [
    {
      planName: "Trial",
      price: "0",
      planFeature: {
        interview_count: "-1",
        mail_notification: false,
        upgrade_profile_top: false,
        validate_days: null,
        whatsapp_notification: false,
        export_candidate_lists: false,
      },
    },
    {
      planName: "free",
      price: "0",
      planFeature: {
        interview_count: "-1",
        mail_notification: false,
        upgrade_profile_top: false,
        validate_days: null,
        whatsapp_notification: false,
        export_candidate_lists: false,
      },
    },
    {
      planName: "StartUp",
      price: "1499",
      planFeature: {
        interview_count: "-1",
        mail_notification: true,
        upgrade_profile_top: true,
        validate_days: 90,
        whatsapp_notification: true,
        export_candidate_lists: true,
      },
    },
    {
      planName: "Professionals",
      price: "3999",
      planFeature: {
        interview_count: "-1",
        mail_notification: true,
        upgrade_profile_top: true,
        validate_days: 180,
        whatsapp_notification: true,
        export_candidate_lists: true,
      },
    },
    {
      planName: "Enterprises",
      price: "5999",
      planFeature: {
        interview_count: "-1",
        mail_notification: true,
        upgrade_profile_top: true,
        validate_days: 365,
        whatsapp_notification: true,
        export_candidate_lists: true,
      },
    },
  ];
  // const [Razorpay] = useRazorpay();

  return (
    <div id="pricing-table">
      <div className="d-flex justify-content-center">
        {" "}
        <img
          src={logo}
          alt="logo"
          className="img-fluid"
          style={{ width: "250px", height: "120px" }}
        />
      </div>

      <div className="text-center">
        <h1 className="mt-2 mb-2 " style={{ color: "#843762" }}>
          We’ve got a pricing plan that’s perfect for you
        </h1>
      </div>
      <PricingCards
        data={plandata !== null ? plandata : []}
        plan_feature_id={currentPlan?.plan_feature_id}
        planId={currentPlan?.id}
      />
    </div>
  );
};

export default Pricing;
