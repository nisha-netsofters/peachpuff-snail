import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import {
  createjobCatAPI,
  getjobCatAPI,
  updatejobCatAPI,
  deletejobCatAPI,
  getFilterjobCat,
  getalljobCatAPI,
} from "../../apis/jobCategory";
import { tostifySuccess } from "../../components/Tostify";

export function* WATCH_GET_JOBCAT(action) {
  const resp = yield getjobCatAPI(action.payload);
  yield put({
    type: actions.SET_JOBCAT,
    payload: resp,
  });
}

export function* WATCH_GET_ALL_JOBCAT() {
  const resp = yield getalljobCatAPI();
  yield put({
    type: actions.SET_JOBCAT,
    payload: resp,
  });
}

export function* WATCH_CREATE_JOBCAT(action) {
  const data = yield createjobCatAPI(action.payload.data);
  if (data?.id) {
    tostifySuccess("Data Posted Successfully");
    const resp = yield getjobCatAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_JOBCAT,
      payload: resp,
    });
  }
}

export function* WATCH_UPDATE_JOBCAT(action) {
  const data = yield updatejobCatAPI(action.payload);
  if (data.msg) {
    tostifySuccess("Data Update Successfully");
    const resp = yield getjobCatAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_JOBCAT,
      payload: resp,
    });
  }
}

export function* WATCH_DELETE_JOBCAT(action) {
  yield deletejobCatAPI(action.payload);
  const resp = yield getjobCatAPI({
    page: action.payload?.page,
    perPage: action.payload?.perPage,
    filterData: [],
  });
  resp.isSuccess = true;
  yield put({
    type: actions.SET_JOBCAT,
    payload: resp,
  });
}

export function* WATCH_FILTER_JOBCAT(action) {
  const resp = yield getFilterjobCat(action.payload);
  yield put({
    type: actions.SET_JOBCAT,
    payload: resp,
  });
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_JOBCAT, WATCH_CREATE_JOBCAT),
    takeEvery(actions.GET_JOBCAT, WATCH_GET_JOBCAT),
    takeEvery(actions.GET_ALL_JOBCAT, WATCH_GET_ALL_JOBCAT),
    takeEvery(actions.UPDATE_JOBCAT, WATCH_UPDATE_JOBCAT),
    takeEvery(actions.DELETE_JOBCAT, WATCH_DELETE_JOBCAT),
    takeEvery(actions.FILTER_JOBCAT, WATCH_FILTER_JOBCAT),
  ]);
}
