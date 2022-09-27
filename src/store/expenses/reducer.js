import * as ACTIONS from "./actions";

const defaultState = {
    showAdd: false,
    search: null, // {null|object}
};

export const expensesReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.EXPENSES_SHOW_ADD:
            return { ...state, showAdd: action.payload }

        case ACTIONS.SEARCH_EXPENSES:
            return { ...state, search: action.payload }

        default:
            return state;

    }

}