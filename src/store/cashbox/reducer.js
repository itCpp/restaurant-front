import * as ACTIONS from "./actions";

const defaultState = {
    showCashboxRowEdit: false, // {boolean|object}
    calendar: false, // {boolean}
};

export const cashboxReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.CASHBOX_ROW_EDIT:
            return { ...state, showCashboxRowEdit: action.payload }

        case ACTIONS.CASHBOX_SHOW_CALENDAR:
            return { ...state, calendar: action.payload }

        default:
            return state;
    }
}
