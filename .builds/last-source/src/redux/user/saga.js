/*eslint-disable */
import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import {
  createUserAPI,
  deleteUserAPI,
  getFilterUser,
  getUserRoleWise,
  getUserAPI,
  updateUserAPI,
  getUserDetails,
  getLoginUserDetail,
  createFreePlan,
} from "../../apis/user";
import { tostifyError, tostifySuccess } from "../../components/Tostify";
import subscriptionsActions from "../subscription/actions";
import authActions from "../auth/actions";

export function* WATCH_GET_USER(action) {
  const resp = yield getUserAPI(action.payload);
  yield put({
    type: actions.SET_USER,
    payload: {
      users: resp,
    },
  });
}

export function* WATCH_CREATE_USER(action) {
  const data = yield createUserAPI(action.payload.data);
  if (data?.error) {
    tostifyError(data?.error);
    action?.setLoading(false);
  }
  if (data?.id) {
    tostifySuccess("Data Posted Successfully");
    const resp = yield getUserAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: [],
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_USER,
      payload: { users: resp, total: resp?.total },
    });
    action?.setLoading(false);
  }
}

export function* WATCH_UPDATE_USER(action) {
  const data = yield updateUserAPI(action.payload);

  if (data.msg) {
    if (data.isSuccess) {
      tostifySuccess("Data Update Successfully");
      const resp = yield getUserAPI({
        page: action.payload?.page,
        perPage: action.payload?.perPage,
        filterData: [],
      });

      resp.isSuccess = true;
      yield put({
        type: actions.SET_USER,
        payload: { users: resp, error: false },
      });
    } else {
      yield put({
        type: actions.SET_USER,
        payload: { error: true },
      });
      // tostifyError(data?.msg)
    }
  }
}

export function* WATCH_DELETE_USER(action) {
  yield deleteUserAPI(action.payload);
  const resp = yield getUserAPI({
    page: action.payload?.page,
    perPage: action.payload?.perPage,
    filterData: [],
  });
  resp.isSuccess = true;
  yield put({
    type: actions.SET_USER,
    payload: {
      users: resp,
    },
  });
}

export function* WATCH_FILTER_USER(action) {
  const resp = yield getFilterUser(action.payload);
  yield put({
    type: actions.SET_USER,
    payload: resp,
  });
}

export function* WATCH_GET_USER_ROLE_WISE(action) {
  const resp = yield getUserRoleWise(action.payload);
  yield put({
    type: actions.SET_USER,
    payload: { roleWise: resp },
  });
}

export function* WATCH_GET_USER_DETAILS(action) {
  const resp = yield getUserDetails(action.payload);
  yield put({
    type: actions.SET_USER,
    payload: {
      user: resp.data,
    },
  });
}

export function* WATCH_GET_LOGIN_USER_DETAIL(action) {
  const resp = yield getLoginUserDetail(action.payload);
  if (resp) {
    yield put({
      type: actions.SET_USER,
      payload: {
        user: resp,
      },
    });
    yield put({
      type: authActions.SET_STATE,
      payload: {
        user: resp,
      },
    });
    yield put({
      type: subscriptionsActions.GET_SUBSCRIPTION,
      payload: {
        subscriptionId: resp?.subscriptionId,
      },
    });
    localStorage.setItem("user", JSON.stringify(resp));
  }
}
export function* WATCH_CREATE_FREE_PLAN() {
  // if (resp) {
  //     yield put({
  //         type: actions.SET_USER,
  //         payload: {
  //             user: resp,
  //         },
  //     });
  //     yield put({
  //         type: subscriptionsActions.GET_SUBSCRIPTION,
  //         payload: {
  //           subscriptionId: resp?.subscriptionId,
  //         },
  //       });
  //     localStorage.setItem("user", JSON.stringify(resp));
  // }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_USER, WATCH_CREATE_USER),
    takeEvery(actions.GET_USER, WATCH_GET_USER),
    takeEvery(actions.UPDATE_USER, WATCH_UPDATE_USER),
    takeEvery(actions.DELETE_USER, WATCH_DELETE_USER),
    takeEvery(actions.FILTER_USER, WATCH_FILTER_USER),
    takeEvery(actions.GET_USER_ROLE_WISE, WATCH_GET_USER_ROLE_WISE),
    takeEvery(actions.GET_USER_DETAILS, WATCH_GET_USER_DETAILS),
    takeEvery(actions.GET_LOGIN_USER_DETAIL, WATCH_GET_LOGIN_USER_DETAIL),
    takeEvery(actions.CREATE_FREE_PLAN, WATCH_CREATE_FREE_PLAN),
  ]);
}
