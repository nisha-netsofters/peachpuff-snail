import actions from "./actions"
const initialState = {
    feedBack: null
}
export const feedBackReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_FEEDBACK:
            state.feedBack = action.payload
            return state.feedBack
        default:
            return state
    }
}