import { all, takeEvery, put } from "redux-saga/effects"
// import { tostifySuccess } from "../../components/Tostify"
import jobOpeningMatchesActions from "./actions"
import { getJobOpeningMatchCandidate, getJobOpeningRow } from "../../apis/jobOpeningMatches";

// const user = JSON.parse(localStorage.getItem("user"))
export function* loading(state) {
    yield put({
      type: jobOpeningMatchesActions.JOB_MATCHES_LOADER,
      payload: state,
    });
  }

export function* WATCH_GET_JOB_OPENING_ROW(action) {
    const resp = yield getJobOpeningRow(action?.payload)
    console.info('--------------------')
    console.info('resp => ', resp )
    console.info('--------------------')
    if (resp) {
        yield put({
            type: jobOpeningMatchesActions.SET_JOB_MATCHES_STATE,
            payload: {
                jobOpeningRow : resp
            }
        })
    }
}

export function* WATCH_GET_JOB_OPENING_MATCH_CANDIDATE(action) {
    const resp = yield getJobOpeningMatchCandidate(action?.payload)
    console.info('--------------------')
    console.info('resp => ', resp )
    console.info('--------------------')
    if (resp) {
        yield put({
            type: jobOpeningMatchesActions.SET_JOB_MATCHES_STATE,
            payload: {
                jobOpeningMatchCandidate : resp
            }
        })
    }
    // const resp = yield findByIdjobOpeningAPI(action.payload)
    // yield put({
    //     type: actions.SET_JOBOPENING,
    //     payload: resp
    // })
}


export default function* rootSaga() {
    yield all([
        takeEvery(jobOpeningMatchesActions.GET_JOB_OPENING_ROW, WATCH_GET_JOB_OPENING_ROW),
        takeEvery(jobOpeningMatchesActions.GET_JOB_OPENING_MATCH_CANDIDATE, WATCH_GET_JOB_OPENING_MATCH_CANDIDATE),
    ])
}