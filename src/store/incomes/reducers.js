import * as ACTIONS from "./actions";

const defaultState = {
    showAdd: false,
    showSourceAdd: false,
    show: false,
    showPartAdd: false,
    showParkingPlaceAdd: false,
    filter: {},
};

export const incomesReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.INCOMES_SHOW_ADD:
            return { ...state, showAdd: action.payload }

        case ACTIONS.INCOMES_SOURCE_ADD:
            return { ...state, showSourceAdd: action.payload }

        case ACTIONS.INCOMES_SHOW:
            return { ...state, show: action.payload }

        case ACTIONS.INCOMES_PART_ADD:
            return { ...state, showPartAdd: action.payload }

        case ACTIONS.INCOMES_PARKING_PLACE_ADD:
            return { ...state, showParkingPlaceAdd: action.payload }

        case ACTIONS.INCOMES_FILTER_SET:
            return { ...state, filter: { ...action.payload } }

        default:
            return state;

    }

}