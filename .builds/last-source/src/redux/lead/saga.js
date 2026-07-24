import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import {
  createLeadAPI,
  getLeadAPI,
  updateLeadAPI,
  deleteLeadAPI,
  getFilterLead,
  approveLead,
  declinedLead,
} from "../../apis/lead";
import { tostifyError, tostifySuccess } from "../../components/Tostify";

export function* WATCH_GET_LEAD(action) {
  const resp = yield getLeadAPI(action.payload);
  yield put({
    type: actions.SET_LEAD,
    payload: resp,
  });
}

export function* WATCH_CREATE_LEAD(action) {
  const data = yield createLeadAPI(action.payload);

  if (data?.data?.id) {
    tostifySuccess("Data Posted Successfully");
    yield put({
      type: actions.SET_LEAD,
      payload: data?.data,
    });
  }
}

export function* WATCH_UPDATE_LEAD(action) {
  const data = yield updateLeadAPI(action.payload);
  if (data.msg) {
    tostifySuccess("Data Update Successfully");
    const resp = yield getLeadAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_LEAD,
      payload: resp,
    });
  }
}

export function* WATCH_DELETE_LEAD(action) {
  yield deleteLeadAPI(action.payload);
  const resp = yield getLeadAPI({
    page: action.payload?.page,
    perPage: action.payload?.perPage,
    filterData: [],
  });
  resp.isSuccess = true;
  yield put({
    type: actions.SET_LEAD,
    payload: resp,
  });
}

export function* WATCH_FILTER_LEAD(action) {
  const resp = yield getFilterLead(action.payload);
  yield put({
    type: actions.SET_LEAD,
    payload: resp,
  });
}

export function* WATCH_APPROVE_LEAD(action) {
  const resp = yield approveLead(action.payload);
  if (resp.error) {
    tostifyError(resp.error);
  }
  if (resp?.constraint) {
    yield put({
      type: actions.SET_LEAD,
      payload: resp,
    });
  } else if (resp) {
    const resp = yield getLeadAPI({
      page: 1,
      perPage: 10,
      filterData: [],
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_LEAD,
      payload: resp,
    });
  }
}
export function* WATCH_DECLINED_LEAD(action) {
  const resp = yield declinedLead(action.payload);
  if (resp?.msg === "success") {
    tostifySuccess("Lead Declined Successfully");
  }
  if (resp) {
    const resp = yield getLeadAPI({
      page: 1,
      perPage: 10,
      filterData: [],
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_LEAD,
      payload: resp,
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_LEAD, WATCH_CREATE_LEAD),
    takeEvery(actions.GET_LEAD, WATCH_GET_LEAD),
    takeEvery(actions.UPDATE_LEAD, WATCH_UPDATE_LEAD),
    takeEvery(actions.DELETE_LEAD, WATCH_DELETE_LEAD),
    takeEvery(actions.FILTER_LEAD, WATCH_FILTER_LEAD),
    takeEvery(actions.APPROVE_LEAD, WATCH_APPROVE_LEAD),
    takeEvery(actions.DECLINED_LEAD, WATCH_DECLINED_LEAD),
  ]);
}
