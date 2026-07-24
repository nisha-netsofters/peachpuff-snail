import { all, takeEvery, put, select } from "redux-saga/effects";
import actions from "./actions";
import {
  approveClient,
  createClientAPI,
  declinedClient,
  deleteClientAPI,
  getAllClientsAPI,
  getClientAPI,
  getClientId,
  getFilterClient,
  interviewRequest,
  mailNotificationStatus,
  publicClient,
  updateClientAPI,
  whatsappNotificationStatus,
} from "../../apis/client";
import { tostifyError, tostifySuccess } from "../../components/Tostify";
import userActions from "../user/actions";
import subscriptionsActions from "../subscription/actions";
import candidateActions from "../candidate/actions";
import { getClientCandidateAPI } from "../../apis/candidate";
import { getLoginUserDetail } from "../../apis/user";

export function* WATCH_GET_CLIENT(action) {
  const resp = yield getClientAPI(action.payload);
  yield put({
    type: actions.SET_CLIENT,
    payload: resp,
  });
}

export function* WATCH_GET_All_CLIENT() {
  const resp = yield getAllClientsAPI();
  yield put({
    type: actions.SET_CLIENT,
    payload: resp,
  });
}

export function* WATCH_CREATE_CLIENT(action) {
  const data = yield createClientAPI(action.payload.data);
  if (data?.error) {
    tostifyError(data?.error);
    action?.payload?.setLoading(false);
  }
  if (data?.id) {
    tostifySuccess("Data Posted Successfully");
    const resp = yield getClientAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: action?.payload?.filterData,
    });
    resp.isSuccess = true;
    yield put({
      type: actions.SET_CLIENT,
      payload: resp,
    });
  } else if (data.constraint === "clients_email_unique") {
    yield put({
      type: actions.SET_CLIENT,
      payload: data,
    });
  } else if (data.constraint === "clients_mobile_unique") {
    yield put({
      type: actions.SET_CLIENT,
      payload: data,
    });
  }
}

export function* WATCH_UPDATE_CLIENT(action) {
  const data = yield updateClientAPI(action.payload);
  if (data?.error) {
    tostifyError(data?.error);
    action?.payload?.setLoading(false);
  }
  if (data.msg) {
    tostifySuccess("Data Update Successfully");
    const resp = yield getClientAPI({
      page: action.payload?.page,
      perPage: action.payload?.perPage,
      filterData: action?.payload?.filterData,
    });
    resp.isSuccess = true;
    resp.loading = false;
    yield put({
      type: actions.SET_CLIENT,
      payload: resp,
    });
  }
}

export function* WATCH_DELETE_CLIENT(action) {
  const clientResults = yield select((state) => state?.client);
  const data = yield deleteClientAPI(action.payload);
  if (data) {
   const data = clientResults?.results.filter(item => item.id !== action.payload?.id);
    yield put({
      type: actions.SET_CLIENT,
      payload: {
        results: data
      },
    });
    action?.setLoading(false)
  }
  action?.setLoading(false)
}

export function* WATCH_FILTER_CLIENT(action) {
  const resp = yield getFilterClient(action.payload);
  yield put({
    type: actions.SET_CLIENT,
    payload: resp,
  });
}

export function* WATCH_APPROVE_CLIENT(action) {
  const clientResults = yield select((state) => state?.client);
  const resp = yield approveClient(action.payload);
  if (resp?.constraint) {
    yield put({
      type: actions.SET_CLIENT,
      payload: resp,
    });
  } else if (resp) {
    const index = clientResults?.results?.findIndex(
      (item) => item.id === action.payload?.id
    );
    if (index !== -1) {
      clientResults.results[index].action = "approved";
    }
    yield put({
      type: actions.SET_CLIENT,
      payload: clientResults,
    });
    action?.setLoading(false)
  }
  action?.setLoading(false)
}
export function* WATCH_DECLINED_CLIENT(action) {
  const clientResults = yield select((state) => state?.client);
  const resp = yield declinedClient(action.payload);

  if (resp) {
    const index = clientResults?.results?.findIndex(
      (item) => item.id === action.payload?.id
    );
    if (index !== -1) {
      clientResults.results[index].action = "declined";
    }
    yield put({
      type: actions.SET_CLIENT,
      payload: clientResults,
    });
    action?.setLoading(false)
  }
  action?.setLoading(false)
}
export function* PUBLIC_CLIENT(action) {
  const resp = yield publicClient(action.payload);
  if (resp?.id) {
    yield put({
      type: actions.SET_CLIENT,
      payload: resp,
    });
  } else {
    yield put({
      type: actions.SET_CLIENT,
      payload: resp,
    });
  }
}

export function* WATCH_INTERVIEW_REQUEST(action) {
  yield put({
    type: candidateActions.GET_CLIENT_CANDIDATE_LOADER,
    payload: true,
  });
  try {
    const resp = yield interviewRequest(action.payload);
    if (resp) {
      yield put({
        type: candidateActions.GET_CLIENT_CANDIDATE_LOADER,
        payload: false,
      });
    }
    if (resp?.msg) {
      yield put({
        type: actions.SET_CLIENT,
        payload: resp,
      });
      yield put({
        type: actions.INTERVIEW_REQUEST_POPUP,
        payload: true,
      });
    }
    if (resp?.msg) {
      const { planId } = yield select(
        (state) => state?.auth?.user?.subscription
      );
      const resp1 = yield getClientCandidateAPI(
        action.payload?.clientCandidateData,
        planId
      );
      if (resp1) {
        yield put({
          type: candidateActions.SET_CANDIDATE,
          payload: resp1,
        });
      }
    }
  } catch (err) {
    console.info("--------------------");
    console.info("err => ", err);
    console.info("--------------------");
    yield put({
      type: candidateActions.GET_CLIENT_CANDIDATE_LOADER,
      payload: false,
    });
  }
}

export function* WATCH_GET_CLIENT_DETAIL(action) {
  yield put({
    type: actions.CLIENT_LOADING,
    payload: {
      loading: true,
    },
  });
  try {
    const resp = yield getClientId(action.payload);
    resp.loading = false;
    if (resp?.msg) {
      yield put({
        type: actions.SET_CLIENT,
        payload: resp,
      });
    }
    yield put({
      type: actions.CLIENT_LOADING,
      payload: {
        loading: false,
      },
    });
  } catch (err) {
    console.info("--------------------");
    console.info("err => ", err);
    console.info("--------------------");
    yield put({
      type: actions.CLIENT_LOADING,
      payload: {
        loading: false,
      },
    });
  }
}
export function* WATCH_WHATSAPP_NOTIFICATION_STATUS(action) {
  yield put({
    type: actions.CLIENT_LOADING,
    payload: {
      loading: true,
    },
  });
  try {
    const response = yield whatsappNotificationStatus(action.payload);
    if (response?.length) {
      const resp = yield getLoginUserDetail(response[0]?.userId);
      if (resp) {
        yield put({
          type: userActions.SET_USER,
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
        yield put({
          type: actions.CLIENT_LOADING,
          payload: {
            loading: false,
          },
        });
      }
    }
  } catch (err) {
    console.info("--------------------");
    console.info("err => ", err);
    console.info("--------------------");
    yield put({
      type: actions.CLIENT_LOADING,
      payload: {
        loading: false,
      },
    });
  }
}

export function* WATCH_MAIL_NOTIFICATION_STATUS(action) {
  yield put({
    type: actions.CLIENT_LOADING,
    payload: {
      loading: true,
    },
  });
  try {
    const response = yield mailNotificationStatus(action.payload);
    if (response?.length) {
      const resp = yield getLoginUserDetail(response[0]?.userId);
      if (resp) {
        yield put({
          type: userActions.SET_USER,
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
        yield put({
          type: actions.CLIENT_LOADING,
          payload: {
            loading: false,
          },
        });
      }
    }
  } catch (err) {
    console.info("--------------------");
    console.info("err => ", err);
    console.info("--------------------");
    yield put({
      type: actions.CLIENT_LOADING,
      payload: {
        loading: false,
      },
    });
  }
  yield put({
    type: actions.CLIENT_LOADING,
    payload: {
      loading: false,
    },
  });
}
export function* WATCH_UPDATE_CLIENT_PROFILE(action) {
  const id = JSON.parse(localStorage.getItem("user")).id;
  yield put({
    type: actions.CLIENT_LOADING,
    payload: {
      loading: true,
    },
  });
  try {
    const data = yield updateClientAPI(action.payload);
    if (data.msg) {
      tostifySuccess("Data Update Successfully");
      yield put({
        type: userActions.GET_USER_DETAILS,
        payload: {
          id,
        },
      });
      yield put({
        type: actions.CLIENT_ISSUCCESS,
      });
    } else {
      yield put({
        type: actions.CLIENT_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  } catch (err) {
    console.info("--------------------");
    console.info("err => ", err);
    console.info("--------------------");
    yield put({
      type: actions.CLIENT_LOADING,
      payload: {
        loading: false,
      },
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_CLIENT, WATCH_CREATE_CLIENT),
    takeEvery(actions.GET_CLIENT, WATCH_GET_CLIENT),
    takeEvery(actions.GET_All_CLIENT, WATCH_GET_All_CLIENT),
    takeEvery(actions.UPDATE_CLIENT, WATCH_UPDATE_CLIENT),
    takeEvery(actions.DELETE_CLIENT, WATCH_DELETE_CLIENT),
    takeEvery(actions.FILTER_CLIENT, WATCH_FILTER_CLIENT),
    takeEvery(actions.APPROVE_CLIENT, WATCH_APPROVE_CLIENT),
    takeEvery(actions.DECLINED_CLIENT, WATCH_DECLINED_CLIENT),
    takeEvery(actions.PUBLIC_CLIENT, PUBLIC_CLIENT),
    takeEvery(actions.INTERVIEW_REQUEST, WATCH_INTERVIEW_REQUEST),
    takeEvery(actions.GET_CLIENT_Detail, WATCH_GET_CLIENT_DETAIL),
    takeEvery(actions.UPDATE_CLIENT_PROFILE, WATCH_UPDATE_CLIENT_PROFILE),
    takeEvery(
      actions.WHATSAPP_NOTIFICATION_STATUS,
      WATCH_WHATSAPP_NOTIFICATION_STATUS
    ),
    takeEvery(actions.MAIL_NOTIFICATION_STATUS, WATCH_MAIL_NOTIFICATION_STATUS),
  ]);
}
