import actions from "./actions"
const initialState = {
    percentage: 0,
    isUploading: false,
    isUploaded: false,
    image: false,
    resume: false,
    uploadedLink: null,
    error: null,
    isError: false
}
export const progressReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_PROGRESS:
            return { ...state, ...action.payload, isUploading: true }
        case actions.SET_UPLOADLINK:
            return { ...state, ...action.payload, isUploaded: true, isUploading: false }
        case actions.SET_ERROR:
            return { ...initialState, ...action.payload, isUploading: false }
        case actions.CLEAR_PROGRESS:
            return initialState
        default:
            return state
    }
}