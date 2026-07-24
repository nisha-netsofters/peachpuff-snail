import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import { tostifySuccess } from "../../components/Tostify";
import {
  createjobOpeningAPI,
  deletejobOpeningAPI,
  findByIdjobOpeningAPI,
  getjobOpeningAPI,
  RestartjobOpeningAPI,
  updatejobOpeningAPI,
} from "../../apis/jobOpening";

const user = JSON.parse(localStorage.getItem("user"));
export function* WATCH_GET_JOBOPENING(action) {
  const resp = yield getjobOpeningAPI(action.payload);
  yield put({
    type: actions.SET_JOBOPENING,
    payload: resp,
  });
}

export function* WATCH_CREATE_JOBOPENING(action) {
  const user = JSON.parse(localStorage.getItem("user"));

  const data = yield createjobOpeningAPI(action.payload.data);
  if (data?.id) {
    tostifySuccess("Data Posted Successfully");
    const resp = yield getjobOpeningAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
      userId: user?.id,
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_JOBOPENING,
      payload: resp,
    });
  }
}

export function* WATCH_UPDATE_JOBOPENING(action) {
  const data = yield updatejobOpeningAPI(action.payload);
  if (data.msg) {
    tostifySuccess("Data Update Successfully");
    const resp = yield getjobOpeningAPI({
      page: 1,
      perPage: 10,
      filterData: [],
      userId: user?.id,
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_JOBOPENING,
      payload: resp,
    });
  }
}

export function* WATCH_DELETE_JOBOPENING(action) {
  const msg = yield deletejobOpeningAPI(action.payload);
  if (msg) {
    const resp = yield getjobOpeningAPI({
      page: 1,
      perPage: 10,
      filterData: [],
      userId: user?.id,
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_JOBOPENING,
      payload: resp,
    });
  }
}
export function* WATCH_RESTART_JOBOPENING(action) {
  const data = yield RestartjobOpeningAPI(action.payload);
  if (data.msg) {
    tostifySuccess("Data Update Successfully");
    const resp = yield getjobOpeningAPI({
      page: 1,
      perPage: 10,
      filterData: [],
      userId: user?.id,
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_JOBOPENING,
      payload: resp,
    });
  }
}

export function* WATCH_FIND_BY_ID_JOBOPENING(action) {
  const resp = yield findByIdjobOpeningAPI(action.payload);
  yield put({
    type: actions.SET_JOBOPENING,
    payload: resp,
  });
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_JOBOPENING, WATCH_CREATE_JOBOPENING),
    takeEvery(actions.FIND_BY_ID_JOBOPENING, WATCH_FIND_BY_ID_JOBOPENING),
    takeEvery(actions.GET_JOBOPENING, WATCH_GET_JOBOPENING),
    takeEvery(actions.UPDATE_JOBOPENING, WATCH_UPDATE_JOBOPENING),
    takeEvery(actions.DELETE_JOBOPENING, WATCH_DELETE_JOBOPENING),
    takeEvery(actions.RESTART_JOBOPENING, WATCH_RESTART_JOBOPENING),
    // takeEvery(actions.FILTER_ONBOARDING, WATCH_FILTER_ONBOARDING)
  ]);
}
