import { all, takeEvery, put } from "redux-saga/effects";
import actions from "./actions";
import { tostifyError, tostifySuccess } from "../../components/Tostify";
import {
  createCourseApi,
  createEducationApi,
  deleteCourseAPI,
  deleteEducationAPI,
  getCourseListAPI,
  getEducationListAPI,
  updateCourseAPI,
  updateEducationAPI,
} from "../../apis/education";

function* WATCH_GET_EDUCATIONS(action) {
  const resp = yield getEducationListAPI(action.payload);
  yield put({
    type: actions.SET_EDUCATIONS,
    payload: {
      results: resp?.results || [],
      total: resp?.total || 0,
      isSuccess: false,
    },
  });
}

function* WATCH_CREATE_EDUCATION(action) {
  const data = yield createEducationApi(action.payload.data);
  if (data?.id) {
    tostifySuccess("Education added successfully");
    const resp = yield getEducationListAPI({
      page: 1,
      perPage: 10,
      filterData: action.payload.filterData || {},
    });
    yield put({
      type: actions.SET_EDUCATIONS,
      payload: {
        results: resp?.results || [],
        total: resp?.total || 0,
        isSuccess: true,
      },
    });
  } else {
    tostifyError(data?.error || "Create failed");
    yield put({
      type: actions.SET_EDUCATIONS,
      payload: { isSuccess: false },
    });
  }
}

function* WATCH_UPDATE_EDUCATION(action) {
  const data = yield updateEducationAPI(action.payload);
  if (data?.msg) {
    tostifySuccess("Education updated successfully");
    const resp = yield getEducationListAPI({
      page: 1,
      perPage: 10,
      filterData: action.payload.filterData || {},
    });
    yield put({
      type: actions.SET_EDUCATIONS,
      payload: {
        results: resp?.results || [],
        total: resp?.total || 0,
        isSuccess: true,
      },
    });
  } else {
    tostifyError(data?.error || "Update failed");
    yield put({
      type: actions.SET_EDUCATIONS,
      payload: { isSuccess: false },
    });
  }
}

function* WATCH_DELETE_EDUCATION(action) {
  yield deleteEducationAPI(action.payload);
  tostifySuccess("Education deleted");
  const resp = yield getEducationListAPI({
    page: 1,
    perPage: 10,
    filterData: action.payload.filterData || {},
  });
  yield put({
    type: actions.SET_EDUCATIONS,
    payload: {
      results: resp?.results || [],
      total: resp?.total || 0,
      isSuccess: true,
    },
  });
}

function* WATCH_GET_COURSES(action) {
  const resp = yield getCourseListAPI(action.payload);
  yield put({
    type: actions.SET_COURSES,
    payload: {
      courseResults: resp?.results || [],
      courseTotal: resp?.total || 0,
      courseSuccess: false,
    },
  });
}

function* WATCH_CREATE_COURSE(action) {
  const data = yield createCourseApi(action.payload.data);
  if (data?.id) {
    tostifySuccess("Course added successfully");
    const resp = yield getCourseListAPI({
      page: 1,
      perPage: 10,
      filterData: action.payload.filterData || {},
    });
    yield put({
      type: actions.SET_COURSES,
      payload: {
        courseResults: resp?.results || [],
        courseTotal: resp?.total || 0,
        courseSuccess: true,
      },
    });
  } else {
    tostifyError(data?.error || "Create failed");
    yield put({
      type: actions.SET_COURSES,
      payload: { courseSuccess: false },
    });
  }
}

function* WATCH_UPDATE_COURSE(action) {
  const data = yield updateCourseAPI(action.payload);
  if (data?.msg) {
    tostifySuccess("Course updated successfully");
    const resp = yield getCourseListAPI({
      page: 1,
      perPage: 10,
      filterData: action.payload.filterData || {},
    });
    yield put({
      type: actions.SET_COURSES,
      payload: {
        courseResults: resp?.results || [],
        courseTotal: resp?.total || 0,
        courseSuccess: true,
      },
    });
  } else {
    tostifyError(data?.error || "Update failed");
    yield put({
      type: actions.SET_COURSES,
      payload: { courseSuccess: false },
    });
  }
}

function* WATCH_DELETE_COURSE(action) {
  yield deleteCourseAPI(action.payload);
  tostifySuccess("Course deleted");
  const resp = yield getCourseListAPI({
    page: 1,
    perPage: 10,
    filterData: action.payload.filterData || {},
  });
  yield put({
    type: actions.SET_COURSES,
    payload: {
      courseResults: resp?.results || [],
      courseTotal: resp?.total || 0,
      courseSuccess: true,
    },
  });
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_EDUCATIONS, WATCH_GET_EDUCATIONS),
    takeEvery(actions.CREATE_EDUCATION, WATCH_CREATE_EDUCATION),
    takeEvery(actions.UPDATE_EDUCATION, WATCH_UPDATE_EDUCATION),
    takeEvery(actions.DELETE_EDUCATION, WATCH_DELETE_EDUCATION),
    takeEvery(actions.GET_COURSES, WATCH_GET_COURSES),
    takeEvery(actions.CREATE_COURSE, WATCH_CREATE_COURSE),
    takeEvery(actions.UPDATE_COURSE, WATCH_UPDATE_COURSE),
    takeEvery(actions.DELETE_COURSE, WATCH_DELETE_COURSE),
  ]);
}
