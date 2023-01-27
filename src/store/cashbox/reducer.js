import * as ACTIONS from "./actions";

const defaultState = {
    showCashboxRowEdit: false, // {boolean|object}
    calendar: false, // {boolean}
    search: null, // {null|object}
};

export const cashboxReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.CASHBOX_ROW_EDIT:
            return { ...state, showCashboxRowEdit: action.payload }

        case ACTIONS.CASHBOX_SHOW_CALENDAR:
            return { ...state, calendar: action.payload }

        case ACTIONS.CASHBOX_SEARCH:
            return { ...state, search: action.payload }

        default:
            return state;
    }
}
