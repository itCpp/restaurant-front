import * as ACTIONS from "./actions";

const defaultState = {
    showAdd: false,
};

export const incomesReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.INCOMES_SHOW_ADD:
            return { ...state, showAdd: action.payload }

        default:
            return state;

    }

}