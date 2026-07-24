import actions from "./actions"

const initialState = {
    lead: null
}

export const leadReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_LEAD:
            state.lead = action.payload
            return state.lead
        default:
            return state
    }
}