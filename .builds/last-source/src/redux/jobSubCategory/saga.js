import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import {
  createJobSubCatAPI,
  getJobSubCatAPI,
  updateJobSubCatAPI,
  deleteJobSubCatAPI,
  getAllJobSubCatAPI,
} from "../../apis/jobSubCategory";
import { tostifySuccess } from "../../components/Tostify";

export function* WATCH_GET_JOBSUBCAT(action) {
  const resp = yield getJobSubCatAPI(action.payload);
  yield put({ type: actions.SET_JOBSUBCAT, payload: resp });
}

export function* WATCH_GET_ALL_JOBSUBCAT(action) {
  const resp = yield getAllJobSubCatAPI(action.payload || {});
  yield put({ type: actions.SET_JOBSUBCAT, payload: resp });
}

export function* WATCH_CREATE_JOBSUBCAT(action) {
  const data = yield createJobSubCatAPI(action.payload.data);
  if (data?.id) {
    tostifySuccess("Data Posted Successfully");
    const resp = yield getJobSubCatAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: action.payload?.filterData || {},
    });
    resp.isSuccess = true;
    yield put({ type: actions.SET_JOBSUBCAT, payload: resp });
  }
}

export function* WATCH_UPDATE_JOBSUBCAT(action) {
  const data = yield updateJobSubCatAPI(action.payload);
  if (data.msg) {
    tostifySuccess("Data Update Successfully");
    const resp = yield getJobSubCatAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: action.payload?.filterData || {},
    });
    resp.isSuccess = true;
    yield put({ type: actions.SET_JOBSUBCAT, payload: resp });
  }
}

export function* WATCH_DELETE_JOBSUBCAT(action) {
  yield deleteJobSubCatAPI(action.payload);
  const resp = yield getJobSubCatAPI({
    page: action.payload?.page,
    perPage: action.payload?.perPage,
    filterData: action.payload?.filterData || {},
  });
  resp.isSuccess = true;
  yield put({ type: actions.SET_JOBSUBCAT, payload: resp });
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_JOBSUBCAT, WATCH_GET_JOBSUBCAT),
    takeEvery(actions.GET_ALL_JOBSUBCAT, WATCH_GET_ALL_JOBSUBCAT),
    takeEvery(actions.CREATE_JOBSUBCAT, WATCH_CREATE_JOBSUBCAT),
    takeEvery(actions.UPDATE_JOBSUBCAT, WATCH_UPDATE_JOBSUBCAT),
    takeEvery(actions.DELETE_JOBSUBCAT, WATCH_DELETE_JOBSUBCAT),
  ]);
}
