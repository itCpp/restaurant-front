import * as ACTIONS from "./actions";
import { combineReducers } from "redux";
import { expensesReducer } from "./expenses/reducer";
import { incomesReducer } from "./incomes/reducers";

const defaultMainState = {
    user: {},
    payTypes: [
        { key: 0, text: "Наличные", value: 1 },
        { key: 1, text: "б/н", value: 2 },
    ]
};

export default combineReducers({
    expenses: expensesReducer,
    incomes: incomesReducer,
    main: (state = defaultMainState, action) => {

        switch (action.type) {

            case ACTIONS.USER_DATA:
                return { ...state, user: action.payload }

            default:
                return state;
        }
    }
});