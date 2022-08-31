import { combineReducers } from "redux";
import { expensesReducer } from "./expenses/reducer";
import * as ACTIONS from "./actions";

const defaultMainState = {
    user: {},
};

export default combineReducers({
    expenses: expensesReducer,
    main: (state = defaultMainState, action) => {

        switch (action.type) {

            case ACTIONS.USER_DATA:
                return { ...state, user: action.payload }

            default:
                return state;
        }
    }
});