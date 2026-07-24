import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import {
  createOnBoardingAPI,
  getOnBoardingAPI,
  deleteOnBoardingAPI,
  updateOnBoardingAPI,
} from "../../apis/onBoarding";
import { tostifySuccess } from "../../components/Tostify";

export function* WATCH_GET_ONBOARDING(action) {
  if (action.payload.userId === undefined) {
    const user = JSON.parse(localStorage.getItem("user"));
    action.payload.userId = user.id;
  }
  const resp = yield getOnBoardingAPI(action.payload);
  yield put({
    type: actions.SET_ONBOARDING,
    payload: resp,
  });
}

export function* WATCH_CREATE_ONBOARDING(action) {
  const data = yield createOnBoardingAPI(action.payload.data);
  if (data?.id) {
    tostifySuccess("Data Posted Successfully");
    const user = JSON.parse(localStorage.getItem("user"));
    const resp = yield getOnBoardingAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
      userId: user?.id,
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_ONBOARDING,
      payload: resp,
    });
  }
}

export function* WATCH_UPDATE_ONBOARDING(action) {
  const data = yield updateOnBoardingAPI(action.payload);
  if (data.msg) {
    tostifySuccess("Data Update Successfully");
    const user = JSON.parse(localStorage.getItem("user"));
    const resp = yield getOnBoardingAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
      userId: user?.id,
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_ONBOARDING,
      payload: resp,
    });
  }
}

export function* WATCH_DELETE_ONBOARDING(action) {
  const data = yield deleteOnBoardingAPI(action.payload);
  if (data.msg == "success") {
    const user = JSON.parse(localStorage.getItem("user"));
    const resp = yield getOnBoardingAPI({
      page: 1,
      perPage: 10,
      filterData: [],
      userId: user?.id,
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_ONBOARDING,
      payload: resp,
    });
  }
}

// export function* WATCH_FILTER_ONBOARDING(action) {
//     const resp = yield getFilterONBOARDING(action.payload)
//     yield put({
//         type: actions.SET_ONBOARDING,
//         payload: resp
//     })
// }

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_ONBOARDING, WATCH_CREATE_ONBOARDING),
    takeEvery(actions.GET_ONBOARDING, WATCH_GET_ONBOARDING),
    takeEvery(actions.UPDATE_ONBOARDING, WATCH_UPDATE_ONBOARDING),
    takeEvery(actions.DELETE_ONBOARDING, WATCH_DELETE_ONBOARDING),
    // takeEvery(actions.FILTER_ONBOARDING, WATCH_FILTER_ONBOARDING)
  ]);
}
