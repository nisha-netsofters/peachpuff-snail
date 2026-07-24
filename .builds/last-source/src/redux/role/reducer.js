import actions from "./actions"

export const roleReducer = (state = [], action) => {
    switch (action.type) {
        case actions.GET_ROLES:
            return action.payload
        default:
            return state
    }
}