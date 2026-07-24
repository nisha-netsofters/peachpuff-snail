// redux/jobApplyList/saga.js
import { takeLatest, call, put } from "redux-saga/effects";
import jobApplyListActions from "./actions";
import { getJobApplyListAPI } from "../../apis/jobapplylist";

function* getJobApplyListSaga({ payload }) {
  try {
    yield put({
      type: jobApplyListActions.SET_JOB_APPLY_LIST_LOADER,
      payload: true,
    });

   
    const data = yield call(getJobApplyListAPI, payload.jobId);


    yield put({
      type: jobApplyListActions.GET_JOB_APPLY_LIST_SUCCESS,
      
      payload: data,
    });
  } catch (error) {
    yield put({
      type: jobApplyListActions.GET_JOB_APPLY_LIST_FAILURE,
      payload: error?.response?.data || error.message,
    });
  } finally {
    yield put({
      type: jobApplyListActions.SET_JOB_APPLY_LIST_LOADER,
      payload: false,
    });
  }
}

export default function* jobApplyListSaga() {
  yield takeLatest(
    jobApplyListActions.GET_JOB_APPLY_LIST,
    getJobApplyListSaga
  );
}
