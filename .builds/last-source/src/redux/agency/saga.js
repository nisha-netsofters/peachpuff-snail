import { all, takeEvery, put } from "redux-saga/effects";
// import axios from "axios"
import agencyActions from "./actions";
import {
  createAgency,
  deleteAgency,
  getAgency,
  getAgencyDashboard,
  getAgencyDetailBySlug,
  getAgencycount,
  updateAgency,
  getAgencyDashboardTableData,
  getTransaction,
} from "../../apis/agency";

export function* loading(state) {
  yield put({
    type: agencyActions.SET_AGENCY_LOADING,
    payload: state,
  });
}

export function* WATCH_CREATE_AGENCY(action) {
  yield loading(true);
  try {
    const resp = yield createAgency(action.payload);
    console.info("--------------------");
    console.info("resp => ", resp);
    console.info("--------------------");
  } catch (err) {
    console.info("--------------------");
    console.info("err => ", err);
    console.info("--------------------");
    yield loading(false);
  }
  yield loading(false);
}

export function* WATCH_GET_AGENCY(action) {
  yield loading(true);
  try {
    const resp = yield getAgency(action.payload);
    if (resp?.data?.length || resp?.data?.length == 0) {
      yield put({
        type: agencyActions.SET_AGENCY_STATE,
        payload: {
          allAgency: resp,
        },
      });
      yield loading(false);
    } else {
      yield loading(false);
    }
  } catch (err) {
    yield loading(false);
  }
}

export function* WATCH_UPDATE_AGENCY(action) {
  yield loading(true);
  try {
    const resp = yield updateAgency(action.payload);
    console.info("----------------------------");
    console.info("resp =>", resp);
    console.info("----------------------------");
  } catch (err) {
    yield loading(false);
  }
  yield loading(false);
}

export function* WATCH_DELETE_AGENCY(action) {
  yield loading(true);
  try {
    const resp = yield deleteAgency(action.payload);
    console.info("----------------------------");
    console.info("resp =>", resp);
    console.info("----------------------------");
  } catch (err) {
    yield loading(false);
  }
  yield loading(false);
}

export function* WATCH_GET_AGENCY_DETAIL_BY_SLUG(action) {
  yield loading(true);
  try {
    const resp = yield getAgencyDetailBySlug(action.payload);
    yield put({
      type: agencyActions.SET_AGENCY_STATE,
      payload: {
        agencyDetail: resp,
      },
    });
  } catch (err) {
    yield loading(false);
  }
  yield loading(false);
}
export function* WATCH_GET_TRANSACTION(action) {
  yield loading(true);
  try {
    const resp = yield getTransaction(action.payload);
    yield put({
      type: agencyActions.SET_TRANSACTION,
      payload: resp,
    });
  } catch (err) {
    yield loading(false);
  }
  yield loading(false);
}

export function* WATCH_GET_AGENCY_COUNT() {
  yield loading(true);
  try {
    const resp = yield getAgencycount();
    yield put({
      type: agencyActions.SET_AGENCY_COUNT,
      payload: resp,
    });
  } catch (err) {
    yield loading(false);
  }
  yield loading(false);
}

export function* WATCH_GET_AGENCY_DASHBOARD_TABLE_DATA(payload) {
  yield loading(true);
  try {
    const resp = yield getAgencyDashboardTableData(payload);
    yield put({
      type: agencyActions.SET_AGENCY_DASHBOARD_TABLE_DATA,
      payload: resp,
    });
  } catch (err) {
    yield loading(false);
  }
  yield loading(false);
}

export function* WATCH_GET_AGENCY_DASHBOARD() {
  yield loading(true);
  try {
    const resp = yield getAgencyDashboard();
    yield put({
      type: agencyActions.SET_AGENCY_DASHBOARD,
      payload: resp,
    });
  } catch (err) {
    yield loading(false);
  }
  yield loading(false);
}

export default function* rootSaga() {
  yield all([
    takeEvery(agencyActions.CREATE_AGENCY, WATCH_CREATE_AGENCY),
    takeEvery(agencyActions.GET_AGENCY, WATCH_GET_AGENCY),
    takeEvery(agencyActions.UPDATE_AGENCY, WATCH_UPDATE_AGENCY),
    takeEvery(agencyActions.DELETE_AGENCY, WATCH_DELETE_AGENCY),
    takeEvery(
      agencyActions.GET_AGENCY_DETAIL_BY_SLUG,
      WATCH_GET_AGENCY_DETAIL_BY_SLUG
    ),
    takeEvery(agencyActions.GET_AGENCY_COUNT, WATCH_GET_AGENCY_COUNT),
    takeEvery(agencyActions.GET_AGENCY_DASHBOARD, WATCH_GET_AGENCY_DASHBOARD),
    takeEvery(agencyActions.GET_TRANSACTION, WATCH_GET_TRANSACTION),
    takeEvery(
      agencyActions.GET_AGENCY_DASHBOARD_TABLE_DATA,
      WATCH_GET_AGENCY_DASHBOARD_TABLE_DATA
    ),
  ]);
}
