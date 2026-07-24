import actions from "./actions"

const initialState = {
    onBoarding: null
}

export const onBoardingReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_ONBOARDING:
            state.onBoarding = action.payload
            return state.onBoarding
        default:
            return state
    }
}