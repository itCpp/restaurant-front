import * as ACTIONS from "./actions";
import { combineReducers } from "redux";
import { expensesReducer } from "./expenses/reducer";
import { incomesReducer } from "./incomes/reducers";

const defaultMainState = {
    user: {},
    login: false,
    payTypes: [
        {
            key: 0,
            text: "Наличные",
            value: 1
        },
        {
            key: 1,
            text: "б/н",
            value: 2,
            icon: {
                name: "credit card",
                color: "green",
            }
        },
    ]
};

export default combineReducers({
    expenses: expensesReducer,
    incomes: incomesReducer,
    main: (state = defaultMainState, action) => {

        switch (action.type) {

            case ACTIONS.IS_LOGIN:
                return { ...state, login: action.payload }

            case ACTIONS.USER_DATA:
                return { ...state, user: action.payload }

            default:
                return state;
        }
    }
});