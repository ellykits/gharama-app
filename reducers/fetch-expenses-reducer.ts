import {ExpenseActions, ExpenseState} from "../common/redux-types";

const expenseDefaultState: ExpenseState = {
    expenses: [],
    isLoading: true
};

const expenseReducer = (state = expenseDefaultState, action: ExpenseActions): ExpenseState => {
    if (action.type === "SAVE_EXPENSES") {
        return Object.assign({}, state, {expenses: state.expenses.concat(action.payload), isLoading: false});
    }
    return state;
};
export {expenseReducer};
