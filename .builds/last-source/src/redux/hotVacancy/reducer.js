import hotVacancyActions from "./actions"

const initialState = {
    hotVacancy: {}
}

export const hotVacancyReducer = (state = initialState, action) => {
    switch (action.type) {
        case hotVacancyActions.SET_HOT_VACANCY:
            return { ...state, ...action.payload }
        default:
            return state
    }
}