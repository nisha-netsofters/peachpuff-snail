import { all, put, takeEvery } from "redux-saga/effects";
import hotVacancyActions from "./actions";
import { getHotVacancy } from "../../apis/hotVacancy";

export function* WATCH_GET_HOT_VACANCY(action) {
  const resp = yield getHotVacancy(action.payload);
  console.info("--------------------");
  console.info("resp => ", resp);
  console.info("--------------------");
  if (resp) {
      yield put({
        type: hotVacancyActions.SET_HOT_VACANCY,
        payload: {
            hotVacancy: resp,
          },
      });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(hotVacancyActions.GET_HOT_VACANCY, WATCH_GET_HOT_VACANCY),
  ]);
}
