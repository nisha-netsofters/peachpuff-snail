import actions from "./actions"

export const interviewReducer = (state = [], action) => {
    switch (action.type) {
        case actions.SET_INTERVIEW:
            state.interview = action.payload
            return action.payload

        default:
            return state
    }
}