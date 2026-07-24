import actions from "./actions"

const initialState = {
    industries: null
}

export const industriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_INDUSTRIES:
            state.industries = action.payload
            return state.industries
        default:
            return state
    }
}