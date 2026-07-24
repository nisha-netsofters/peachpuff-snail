import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import {
  createFeedBackAPI,
  getFeedBackAPI,
  updateFeedBackAPI,
  deleteFeedBackAPI,
  getFilterFeedBack,
} from "../../apis/feedBack";
import { tostifySuccess } from "../../components/Tostify";

export function* WATCH_GET_FEEDBACK(action) {
  const resp = yield getFeedBackAPI(action.payload);
  yield put({
    type: actions.SET_FEEDBACK,
    payload: resp,
  });
}

export function* WATCH_CREATE_FEEDBACK(action) {
  const data = yield createFeedBackAPI(action.payload.data);
  if (data?.id) {
    tostifySuccess("Data Posted Successfully");
    const resp = yield getFeedBackAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_FEEDBACK,
      payload: resp,
    });
  }
}

export function* WATCH_UPDATE_FEEDBACK(action) {
  const data = yield updateFeedBackAPI(action.payload);
  if (data.msg) {
    tostifySuccess("Data Update Successfully");
    const resp = yield getFeedBackAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_FEEDBACK,
      payload: resp,
    });
  }
}

export function* WATCH_DELETE_FEEDBACK(action) {
  yield deleteFeedBackAPI(action.payload);
  const resp = yield getFeedBackAPI({
    page: action.payload?.page,
    perPage: action.payload?.perPage,
    filterData: [],
  });
  resp.isSuccess = true;
  yield put({
    type: actions.SET_FEEDBACK,
    payload: resp,
  });
}

export function* WATCH_FILTER_FEEDBACK(action) {
  const resp = yield getFilterFeedBack(action.payload);
  yield put({
    type: actions.SET_FEEDBACK,
    payload: resp,
  });
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_FEEDBACK, WATCH_CREATE_FEEDBACK),
    takeEvery(actions.GET_FEEDBACK, WATCH_GET_FEEDBACK),
    takeEvery(actions.UPDATE_FEEDBACK, WATCH_UPDATE_FEEDBACK),
    takeEvery(actions.DELETE_FEEDBACK, WATCH_DELETE_FEEDBACK),
    takeEvery(actions.FILTER_FEEDBACK, WATCH_FILTER_FEEDBACK),
  ]);
}
