import * as ACTIONS from "./actions";

const defaultState = {
    showAdd: false,
};

export const expensesReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.SHOW_ADD:
            return { ...state, showAdd: action.payload }

        default:
            return state;

    }

}