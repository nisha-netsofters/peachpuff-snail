import { all, takeEvery, put } from "redux-saga/effects";
// import axios from "axios"
import actions from "./actions";
import userActions from "../user/actions";
import subscriptionsActions from "../subscription/actions";
import {
  changePassword,
  forgotPassword,
  loginAPI,
  resetPassword,
  superAdminLoginAPI,
  userGetAPI,
} from "../../apis/auth";
import { toast } from "react-toastify";
import { profileUpdate } from "../../apis/profile";
import { tostify, tostifySuccess } from "../../components/Tostify";
import { persistor } from "../store";

export function* loading(state) {
  yield put({
    type: actions.SET_AUTH_LOADING,
    payload: state,
  });
}

export function* WATCH_SIGN_IN(action) {
  yield loading(true);
  try {
  const resp = yield loginAPI(action.payload);
  if (resp?.data?.token) {
    const token = resp?.data?.token;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(resp?.data?.user));

    if (resp.data?.user?.subscriptionId) {
      yield put({
        type: subscriptionsActions.GET_SUBSCRIPTION,
        payload: {
          subscriptionId: resp.data?.user?.subscriptionId,
        },
      });
    }

    yield put({
      type: actions.SET_STATE,
      payload: {
        user: resp.data.user,
        token: resp.data.token,
      },
    });
    yield put({
      type: userActions.SET_USER,
      payload: {
        user: resp.data.user,
        // token: resp.data.token
      },
    });
  } else {
    if (resp?.msg == "Your agency is not active") {
      yield put({
        type: actions.SET_STATE,
        payload: {
          isOpenInactivePopup: true
        },
      });
    } else {
      toast.error(
        <>
        <div className="toastify-body">
          <ul className="list-unstyled mb-0">
            <li key={resp?.msg}>
              <strong>Oops</strong>: {resp?.msg}
            </li>
          </ul>
        </div>
      </>,
      { icon: true, hideProgressBar: true }
      );
    }
  }
} catch (err) {
  console.info('--------------------')
  console.info('err => ', err )
  console.info('--------------------')
  yield loading(false);
}
yield loading(false);
}

export function* WATCH_SUPER_ADMIN_SIGN_IN(action) {
  yield loading(true);
  try {
  const resp = yield superAdminLoginAPI(action.payload);
  console.info('---------------')
  console.info('respeeeeeeeeeeeeeeee', resp)
  console.info('---------------')
  if (resp?.data?.token) {
    console.info('--------------------')
    console.info('1 => ' )
    console.info('--------------------')
    const token = resp?.data?.token;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(resp?.data?.user));
    
    console.info('--------------------')
    console.info('1 => ' )
    console.info('--------------------')

    

    yield put({
      type: actions.SET_STATE,
      payload: {
        user: resp.data.user,
        token: resp.data.token,
      },
    });
    
    console.info('--------------------')
    console.info('1 => ' )
    console.info('--------------------')
    yield put({
      type: userActions.SET_USER,
      payload: {
        user: resp.data.user,
        // token: resp.data.token
      },
    });
    
    console.info('--------------------')
    console.info('1 => ' )
    console.info('--------------------')
  } else {
    toast.error(
      <>
        <div className="toastify-body">
          <ul className="list-unstyled mb-0">
            <li key={resp?.msg}>
              <strong>Oops</strong>: {resp?.msg}
            </li>
          </ul>
        </div>
      </>,
      { icon: true, hideProgressBar: true }
    );
  }
} catch (err) {
  console.info('--------------------')
  console.info('err => ', err )
  console.info('--------------------')
  yield loading(false);
}
yield loading(false);
}

function* WATCH_UPDATE_PROFILE(action) {
  const resp = yield profileUpdate(action.payload);
  if (resp.msg === "success") {
    const user = yield userGetAPI(action.payload.id);
    localStorage.setItem("user", JSON.stringify(user?.data));

    const token = localStorage.getItem("token");
    toast.success("Profile Updated");

    yield put({
      type: actions.SET_STATE,
      payload: {
        user: user?.data,
        token,
      },
    });
  } else {
    toast.error("Profile does'nt Updated");
  }
}

function* WATCH_FORGOT_PASSWORD(action) {
  const resp = yield forgotPassword(action.payload);
  if (resp?.msg === "success") {
    tostifySuccess("Password Update Link is sent to your Email");
  } else if (resp?.msg === "user does'nt exist") {
    tostify("User does'nt exist");
  } else {
    tostify(resp.msg);
  }
}

function* WATCH_CHANGE_PASSWORD(action) {
  const resp = yield changePassword(action.payload);

  if (resp.msg === "success") {
    // alert("password doesn't match")
    toast.success("Password Updated");
  } else if (resp.msg === "Current password doesn't match") {
    toast.error("Current password doesn't match");
  }
}

function* WATCH_RESET_PASSWORD(action) {
  const resp = yield resetPassword(action.payload);
  if (resp?.msg === "invalid_token") {
    alert("Link is Expired");
    window.close();
  } else if (resp?.msg === "success") {
    alert("Password Updated Successfully!");
    window.close();
  }
}

function* WATCH_SIGN_OUT() {
  localStorage.clear();
  window.localStorage.removeItem('persist:root');
  persistor.pause()
  yield put({
    type: actions.SET_STATE,
    payload: {
      user: null,
      token: null,
    },
  });

  yield put({
    type: userActions.SET_USER,
    payload: {
      user: null,
    },
  });
}

function* WATCH_UPDATE_STATE() {}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.SIGN_IN, WATCH_SIGN_IN),
    takeEvery(actions.SUPERADMIN_SIGN_IN, WATCH_SUPER_ADMIN_SIGN_IN),
    takeEvery(actions.UPDATE_PROFILE, WATCH_UPDATE_PROFILE),
    takeEvery(actions.FORGOT_PASSWORD_LINK, WATCH_FORGOT_PASSWORD),
    takeEvery(actions.RESET_PASSWORD, WATCH_RESET_PASSWORD),
    takeEvery(actions.CHANGE_PASSWORD, WATCH_CHANGE_PASSWORD),
    takeEvery(actions.SIGN_OUT, WATCH_SIGN_OUT),
    takeEvery(actions.UPDATE_AUTH_STATE, WATCH_UPDATE_STATE),
  ]);
}
