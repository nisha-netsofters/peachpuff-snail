import actions from "./actions"

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    users: [],
    total: 0,
    error: false
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_USER:
            return { ...state, ...action.payload }
        default:
            return state
    }
}