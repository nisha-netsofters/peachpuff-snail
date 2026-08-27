import { all, takeEvery, put } from "redux-saga/effects"
// import { tostifySuccess } from "../../components/Tostify"
import jobOpeningMatchesActions from "./actions"
import { getJobOpeningMatchCandidate, getJobOpeningRow, getNewJobMatchCandidate } from "../../apis/jobOpeningMatches";

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
    console.info('resp => ', resp)
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
    yield loading(true)
    try {
        // Clear previous rows so empty "no records" does not flash while loading
        yield put({
            type: jobOpeningMatchesActions.SET_JOB_MATCHES_STATE,
            payload: {
                jobOpeningMatchCandidate: { results: [], total: 0 },
            },
        })
        const resp = yield getJobOpeningMatchCandidate(action?.payload)
        console.info('--------------------')
        console.info('resp => ', resp)
        console.info('--------------------')
        if (resp) {
            yield put({
                type: jobOpeningMatchesActions.SET_JOB_MATCHES_STATE,
                payload: {
                    jobOpeningMatchCandidate: resp,
                },
            })
        }
    } finally {
        yield loading(false)
    }
}


export function* WATCH_GET_JOB_OPENING_NEW_MATCH_CANDIDATE(action) {
    yield loading(true)
    try {
        yield put({
            type: jobOpeningMatchesActions.SET_JOB_MATCHES_STATE,
            payload: {
                jobOpeningNewMatchCandidate: { results: [], total: 0 },
            },
        })
        const resp = yield getNewJobMatchCandidate(action?.payload)
        if (resp) {
            yield put({
                type: jobOpeningMatchesActions.SET_JOB_MATCHES_STATE,
                payload: {
                    jobOpeningNewMatchCandidate: resp,
                },
            })
        }
    } finally {
        yield loading(false)
    }
}


export default function* rootSaga() {
    yield all([
        takeEvery(jobOpeningMatchesActions.GET_JOB_OPENING_ROW, WATCH_GET_JOB_OPENING_ROW),
        takeEvery(jobOpeningMatchesActions.GET_JOB_OPENING_MATCH_CANDIDATE, WATCH_GET_JOB_OPENING_MATCH_CANDIDATE),
        takeEvery(jobOpeningMatchesActions.GET_JOB_OPENING_NEW_MATCH_CANDIDATE, WATCH_GET_JOB_OPENING_NEW_MATCH_CANDIDATE),
    ])
}
