import { all, takeEvery, put } from "redux-saga/effects"
import actions from "./actions"
import { tostifySuccess } from "../../components/Tostify"
import { createIndustriesApi, deleteIndustriesAPI, getallIndustriesAPI, getIndustriesAPI, updateIndustriesAPI } from "../../apis/industries"

export function* WATCH_GET_INDUSTRIES(action) {
    const resp = yield getIndustriesAPI(action.payload)
    yield put({
        type: actions.SET_INDUSTRIES,
        payload: resp
    })
}

export function* WATCH_GET_ALL_IDUSTRIES() {
    const resp = yield getallIndustriesAPI()
    yield put({
        type: actions.SET_INDUSTRIES,
        payload: resp
    })
}

export function* WATCH_CREATE_INDUSTRIES(action) {
    const data = yield createIndustriesApi(action.payload.data)
    if (data?.id) {
        tostifySuccess("Data Posted Successfully")
        const resp = yield getIndustriesAPI({ page: 1, perPage: 10, filterData: [] })
        resp.isSuccess = true
        yield put({
            type: actions.SET_INDUSTRIES,
            payload: resp
        })
    }
}

export function* WATCH_UPDATE_INDUSTRIES(action) {
    const data = yield updateIndustriesAPI(action.payload)
    if (data.msg) {
        tostifySuccess("Data Update Successfully")
        const resp = yield getIndustriesAPI({ page: 1, perPage: 10, filterData: [] })
        resp.isSuccess = true
        yield put({
            type: actions.SET_INDUSTRIES,
            payload: resp
        })
    }
}

export function* WATCH_DELETE_INDUSTRIES(action) {
    yield deleteIndustriesAPI(action.payload)
    const resp = yield getIndustriesAPI({ page: 1, perPage: 10, filterData: [] })
    resp.isSuccess = true
    yield put({
        type: actions.SET_INDUSTRIES,
        payload: resp
    })

}

export function* WATCH_FILTER_INDUSTRIES(action) {
    const resp = yield getFilterIndustries(action.payload)
    yield put({
        type: actions.SET_INDUSTRIES,
        payload: resp
    })
}

export default function* rootSaga() {
    yield all([
        takeEvery(actions.CREATE_INDUSTRIES, WATCH_CREATE_INDUSTRIES),
        takeEvery(actions.GET_INDUSTRIES, WATCH_GET_INDUSTRIES),
        takeEvery(actions.GET_ALL_INDUSTRIES, WATCH_GET_ALL_IDUSTRIES),
        takeEvery(actions.UPDATE_INDUSTRIES, WATCH_UPDATE_INDUSTRIES),
        takeEvery(actions.DELETE_INDUSTRIES, WATCH_DELETE_INDUSTRIES),
        takeEvery(actions.FILTER_INDUSTRIES, WATCH_FILTER_INDUSTRIES)
    ])
}