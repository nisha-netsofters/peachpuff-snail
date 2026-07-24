// redux/resume/saga.js
import { all, takeEvery, put, call } from "redux-saga/effects";
import actions from "./action";
import { postResumeList, updateResumeStatus } from "../../apis/resume";

const mapUiStatusToApi = (ui) => {
  switch (ui) {
    case "Requested":
      return "requested";
    case "In Review":
      return "inreview";
    case "Completed":
      return "completed";
    case "Rejected":
      return "rejected";
    default:
      return "requested";
  }
};

export function* WATCH_POST_RESUME_LIST(action) {
  try {
    yield put({ type: actions.POST_RESUME_LIST_LOADER, payload: true });
    const resp = yield call(postResumeList, action.payload);
    console.log("RESUME API RESP in saga ===>", resp);
    yield put({ type: actions.SET_RESUME_LIST, payload: resp });
  } catch (err) {
    console.error("Error in WATCH_POST_RESUME_LIST:", err);
  } finally {
    yield put({ type: actions.POST_RESUME_LIST_LOADER, payload: false });
  }
}

export function* WATCH_UPDATE_RESUME_STATUS(action) {
  try {
    yield put({ type: actions.UPDATE_RESUME_STATUS_LOADER, payload: true });

    const { id, status } = action.payload; // status from UI
    const apiStatus = mapUiStatusToApi(status);

    // 👇 call backend with correct endpoint + body
    yield call(updateResumeStatus, { id, status: apiStatus });

    // update redux with UI label, or apiStatus – your choice
    yield put({
      type: actions.UPDATE_RESUME_STATUS_SUCCESS,
      payload: { id, status: apiStatus },
    });
  } catch (err) {
    console.error("Error in WATCH_UPDATE_RESUME_STATUS:", err);
  } finally {
    yield put({ type: actions.UPDATE_RESUME_STATUS_LOADER, payload: false });
  }
}

export default function* resumeRootSaga() {
  yield all([
    takeEvery(actions.POST_RESUME_LIST, WATCH_POST_RESUME_LIST),
    takeEvery(actions.UPDATE_RESUME_STATUS, WATCH_UPDATE_RESUME_STATUS),
  ]);
}
