import * as ACTIONS from "./actions";

const defaultState = {
    showAdd: false,
    showSourceAdd: false,
    show: false,
};

export const incomesReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.INCOMES_SHOW_ADD:
            return { ...state, showAdd: action.payload }

        case ACTIONS.INCOMES_SOURCE_ADD:
            return { ...state, showSourceAdd: action.payload }

        case ACTIONS.INCOMES_SHOW:
            return { ...state, show: action.payload }

        default:
            return state;

    }

}