import { all } from "redux-saga/effects";
import auth from "./auth/saga";
import candidate from "./candidate/saga";
import client from "./client/saga";
import onBoarding from "./onBoarding/saga";
import jobCat from "./jobCategory/saga";
import interview from "./interview/saga";
import role from "./role/saga";
import user from "./user/saga";
import feedBack from "./feedBack/saga";
import subscription from "./subscription/saga";
import plan from "./plan/saga";
import lead from "./lead/saga";
import jobOpening from "./jobOpening/saga";
import industries from "./industries/saga";
import payment from "./payment/saga";
import agency from "./agency/saga";
import jobOpeningMatches from "./jobOpeningMatches/saga";
import hotVacancy from "./hotVacancy/saga";
import resumeSaga from "./resume/saga";
import jobsApplySaga from "./jobsapply/saga";
import jobApplyListSaga from "./jobapplylist/saga";

export default function* rootSaga() {
  yield all([
    auth(),
    candidate(),
    client(),
    onBoarding(),
    jobCat(),
    interview(),
    role(),
    user(),
    feedBack(),
    lead(),
    jobOpening(),
    industries(),
    subscription(),
    plan(),
    payment(),
    agency(),
    jobOpeningMatches(),
    hotVacancy(),
    resumeSaga(),
    jobsApplySaga(),
    jobApplyListSaga()
  ]);
}
