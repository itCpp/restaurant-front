import * as ACTIONS from "./actions";

const defaultState = {
    showCashboxRowEdit: false,
};

export const cashboxReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.CASHBOX_ROW_EDIT:
            return { ...state, showCashboxRowEdit: action.payload }

        default:
            return state;
    }
}
