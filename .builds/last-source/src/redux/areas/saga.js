import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import { tostifyError, tostifySuccess } from "../../components/Tostify";
import {
  createAreaApi,
  deleteAreaAPI,
  getAreasListAPI,
  updateAreaAPI,
} from "../../apis/areas";

function* WATCH_GET_AREAS(action) {
  const resp = yield getAreasListAPI(action.payload);
  yield put({
    type: actions.SET_AREAS,
    payload: {
      results: resp?.results || [],
      total: resp?.total || 0,
      isSuccess: false,
    },
  });
}

function* WATCH_CREATE_AREA(action) {
  const data = yield createAreaApi(action.payload.data);
  if (data?.id) {
    tostifySuccess("Area added successfully");
    const resp = yield getAreasListAPI({
      page: 1,
      perPage: 10,
      filterData: action.payload.filterData || {},
    });
    yield put({
      type: actions.SET_AREAS,
      payload: {
        results: resp?.results || [],
        total: resp?.total || 0,
        isSuccess: true,
      },
    });
  } else {
    tostifyError(data?.error || "Create failed");
  }
}

function* WATCH_UPDATE_AREA(action) {
  const data = yield updateAreaAPI(action.payload);
  if (data?.msg) {
    tostifySuccess("Area updated successfully");
    const resp = yield getAreasListAPI({
      page: 1,
      perPage: 10,
      filterData: action.payload.filterData || {},
    });
    yield put({
      type: actions.SET_AREAS,
      payload: {
        results: resp?.results || [],
        total: resp?.total || 0,
        isSuccess: true,
      },
    });
  } else {
    tostifyError(data?.error || "Update failed");
  }
}

function* WATCH_DELETE_AREA(action) {
  yield deleteAreaAPI(action.payload);
  tostifySuccess("Area deleted");
  const resp = yield getAreasListAPI({
    page: 1,
    perPage: 10,
    filterData: action.payload.filterData || {},
  });
  yield put({
    type: actions.SET_AREAS,
    payload: {
      results: resp?.results || [],
      total: resp?.total || 0,
      isSuccess: true,
    },
  });
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_AREAS, WATCH_GET_AREAS),
    takeEvery(actions.CREATE_AREA, WATCH_CREATE_AREA),
    takeEvery(actions.UPDATE_AREA, WATCH_UPDATE_AREA),
    takeEvery(actions.DELETE_AREA, WATCH_DELETE_AREA),
  ]);
}
