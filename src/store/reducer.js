import * as ACTIONS from "./actions";
import { combineReducers } from "redux";
import { expensesReducer } from "./expenses/reducer";
import { incomesReducer } from "./incomes/reducers";
import { cashboxReducer } from "./cashbox/reducer";

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
        {
            key: 3,
            text: "р/с",
            value: 3,
            icon: {
                name: "file text",
                color: "orange",
            }
        },
    ],
    showShedule: false,
    showSalaryMore: false,
    showEmployeeAddPay: false,
};

export default combineReducers({
    cashbox: cashboxReducer,
    expenses: expensesReducer,
    incomes: incomesReducer,
    main: (state = defaultMainState, action) => {

        switch (action.type) {

            case ACTIONS.IS_LOGIN:
                return { ...state, login: action.payload }

            case ACTIONS.USER_DATA:
                return { ...state, user: action.payload }

            case ACTIONS.SHOW_SHEDULE:
                return { ...state, showShedule: action.payload }

            case ACTIONS.SHOW_SALARY_MORE:
                return { ...state, showSalaryMore: action.payload }

            case ACTIONS.SHOW_ADD_SALARY:
                return { ...state, showEmployeeAddPay: action.payload }

            default:
                return state;
        }
    }
});