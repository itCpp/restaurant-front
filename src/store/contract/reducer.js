import * as ACTIONS from "./actions";

const defaultState = {
    showEdit: false, // {boolean|object}
};

export const contractReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.CONTRACTS_SHOW_EDIT:
            return { ...state, showEdit: action.payload }

        default:
            return state;
    }
}
