import actions from "./actions"

const initialState = {
    jobCat: null
}

export const jobCatReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_JOBCAT:
            state.jobCat = action.payload
            return state.jobCat
        default:
            return state
    }
}