// ** Reducers Imports
import navbar from "./navbar";
import layout from "./layout";
import { authReducer } from "./auth/reducer";
import { candidateReducer } from "./candidate/reducer";
import { clientReducer } from "./client/reducer";
import { onBoardingReducer } from "./onBoarding/reducer";
import { jobCatReducer } from "./jobCategory/reducer";
import { interviewReducer } from "./interview/reducer";
import { roleReducer } from "./role/reducer";
import { userReducer } from "./user/reducer";
import { feedBackReducer } from "./feedBack/reducer";
import { leadReducer } from "./lead/reducer";
import { jobOpeningReducer } from "./jobOpening/reducer";
import { industriesReducer } from "./industries/reducer";
import { progressReducer } from "./fileUploadProgress.js/reducer";
import { subscriptionReducer } from "./subscription/reducer";
import { combineReducers } from "redux";
import { planReducer } from "./plan/reducer";
import { paymentReducer } from "./payment/reducer";
import { agencyReducer } from "./agency/reducer";
import { jobOpeningMatchesReducer } from "./jobOpeningMatches/reducer";
import { hotVacancyReducer } from "./hotVacancy/reducer";
import { resumeReducer } from "./resume/reducer";
import jobsApplyReducer from "./jobsapply/reducer";
import jobApplyListReducer from "./jobapplylist/reducer";

const rootReducer = combineReducers({
  agency: agencyReducer,
  auth: authReducer,
  candidate: candidateReducer,
  client: clientReducer,
  onBoarding: onBoardingReducer,
  jobCategory: jobCatReducer,
  interview: interviewReducer,
  roles: roleReducer,
  user: userReducer,
  feedback: feedBackReducer,
  lead: leadReducer,
  jobOpening: jobOpeningReducer,
  industries: industriesReducer,
  progress: progressReducer,
  subscription: subscriptionReducer,
  plans: planReducer,
  payment: paymentReducer,
  jobOpeningMatches: jobOpeningMatchesReducer,
  hotVacancy: hotVacancyReducer,
  resume: resumeReducer,
  jobsApply: jobsApplyReducer,
  jobApplyList: jobApplyListReducer,
  navbar,
  layout,
  
  
});

export default rootReducer;
