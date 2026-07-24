import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import candidateActions from "../candidate/actions";
import {
  createInterviewAPI,
  getInterviewAPI,
  updateInterviewAPI,
  deleteInterviewAPI,
  getFilterInterview,
} from "../../apis/interview";
import { getCandidateAPI } from "../../apis/candidate";
import { tostifySuccess } from "../../components/Tostify";

const userId = JSON.parse(localStorage.getItem("user"));

export function* WATCH_GET_INTERVIEW(action) {
  const resp = yield getInterviewAPI(action.payload);
  yield put({
    type: actions.SET_INTERVIEW,
    payload: resp,
  });
}

export function* WATCH_CREATE_INTERVIEW(action) {
  const data = yield createInterviewAPI(action.payload.data);
  if (data?.id) {
    tostifySuccess("Data Posted Successfully");
    const resp = yield getInterviewAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
      userId: userId?.id,
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_INTERVIEW,
      payload: resp,
    });
    const res = yield getCandidateAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
    });
    yield put({
      type: candidateActions.SET_CANDIDATE,
      payload: res,
    });
  }
}

export function* WATCH_UPDATE_INTERVIEW(action) {
  const data = yield updateInterviewAPI(action.payload);
  if (data.msg) {
    const user = JSON.parse(localStorage.getItem("user"));
    tostifySuccess("Data Update Successfully");
    const resp = yield getInterviewAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
      userId: user?.id,
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_INTERVIEW,
      payload: resp,
    });
  }
}

export function* WATCH_DELETE_INTERVIEW(action) {
  const deleing = yield deleteInterviewAPI(action.payload);
  if (deleing) {
    const user = JSON.parse(localStorage.getItem("user"));
    const resp = yield getInterviewAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
      userId: user?.id,
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_INTERVIEW,
      payload: resp,
    });
  }
}

export function* WATCH_FILTER_INTERVIEW(action) {
  const resp = yield getFilterInterview(action.payload);
  yield put({
    type: actions.SET_INTERVIEW,
    payload: resp,
  });
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_INTERVIEW, WATCH_CREATE_INTERVIEW),
    takeEvery(actions.GET_INTERVIEW, WATCH_GET_INTERVIEW),
    takeEvery(actions.UPDATE_INTERVIEW, WATCH_UPDATE_INTERVIEW),
    takeEvery(actions.DELETE_INTERVIEW, WATCH_DELETE_INTERVIEW),
    takeEvery(actions.FILTER_INTERVIEW, WATCH_FILTER_INTERVIEW),
  ]);
}
