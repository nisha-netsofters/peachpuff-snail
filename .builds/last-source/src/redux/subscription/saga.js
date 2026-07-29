import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import {
  decreaseResumeDownload,
  getSubscriptionForClient,
} from "../../apis/subscription";
import { resolveAssetUrl } from "../../utility/resolveAssetUrl";
import { tostify, tostifyError } from "../../components/Tostify";

function* WATCH_DECREASE_RESUME_DOWNLOADING(action) {
  try {
    yield put({
      type: actions.SET_SUBSCRIPTION_LODING,
      payload: true,
    });
    const resumeUrl =
      resolveAssetUrl(action.payload?.url) || action.payload?.url;

    if (!resumeUrl) {
      tostify("Resume file not available");
      yield put({
        type: actions.SET_SUBSCRIPTION_LODING,
        payload: false,
      });
      return;
    }

    const resp = yield decreaseResumeDownload(action.payload);

    if (resp?.currentPlan || resp?.isSavedCandidate) {
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
      if (resp?.currentPlan) {
        yield put({
          type: actions.SET_SUBSCRIPTION_STATE,
          payload: {
            ...resp,
            isLoading: false,
          },
        });
      }
    } else if (resp?.msg) {
      // Limit reached / no subscription — show upgrade popup
      yield put({
        type: actions.RESUME_COUNT_FINISH,
        payload: true,
      });
      tostify(resp.msg);
    } else {
      // Unexpected success shape — still try open resume
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
    }
  } catch (error) {
    const apiMsg =
      error?.response?.data?.msg ||
      error?.message ||
      "Unable to open resume. Please try again.";
    tostifyError(apiMsg);
  }
  yield put({
    type: actions.SET_SUBSCRIPTION_LODING,
    payload: false,
  });
}

function* WATCH_GET_SUBSCRIPTION(action) {
  try {
    const { subscriptionId } = action.payload;
    const res = yield getSubscriptionForClient(subscriptionId);
    yield put({
      type: actions.SET_SUBSCRIPTION_STATE,
      payload: {
        currentSubscription: res,
        currentPlan: res?.plan,
      },
    });
  } catch (error) {}
}

export default function* rootSaga() {
  yield all([
    takeEvery(
      actions.DECREASE_RESUME_DOWNLOADING,
      WATCH_DECREASE_RESUME_DOWNLOADING
    ),
    takeEvery(actions.GET_SUBSCRIPTION, WATCH_GET_SUBSCRIPTION),
  ]);
}
