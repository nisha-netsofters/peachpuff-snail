import { takeLatest, call, put } from "redux-saga/effects";
import JobsApplyActions from "./actions";
import { postJobsApplyAPI } from "../../apis/jobsapply"; // ⬅️ path as per your project

function* postJobApplySaga({ payload }) {
  // payload = { jobOpeningId }
  try {
    // start loader
    yield put({
      type: JobsApplyActions.SET_JOB_APPLY_LOADER,
      payload: true
    });

    const res = yield call(postJobsApplyAPI, payload);

    yield put({
      type: JobsApplyActions.POST_JOB_APPLY_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    yield put({
      type: JobsApplyActions.POST_JOB_APPLY_FAILURE,
      payload: error?.response?.data || error.message
    });
  } finally {
    yield put({
      type: JobsApplyActions.SET_JOB_APPLY_LOADER,
      payload: false
    });
  }
}

export default function* jobsApplySaga() {
  // ...your existing watchers
  yield takeLatest(JobsApplyActions.POST_JOB_APPLY, postJobApplySaga);
}
