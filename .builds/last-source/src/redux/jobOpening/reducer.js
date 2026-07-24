import actions from "./actions"

const initialState = {
    jobOpening: null
}

export const jobOpeningReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_JOBOPENING:
            state.jobOpening = action.payload
            return state.jobOpening
        default:
            return state
    }
}