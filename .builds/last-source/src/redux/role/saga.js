import { all, takeEvery, put } from "redux-saga/effects"
import { getRolesAPI } from "../../apis/role"
// import axios from "axios"
import actions from "./actions"

export function* WATCH_GET_ROLES(action) {
    const resp = yield getRolesAPI(action.payload)
    yield put({
        type: actions.GET_ROLES,
        payload: resp
    })
}

export default function* rootSaga() {
    yield all([takeEvery(actions.ROLES, WATCH_GET_ROLES)])
}