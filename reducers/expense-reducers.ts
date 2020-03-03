import {AppActions, ExpenseActions, ExpenseState, SAVE_EXPENSES, UPDATE_EXPENSE_COMMENT} from "../common/redux-types";
import {castDraft, produce} from "immer";
import {Expense} from "../common/common-types";

const expenseDefaultState: ExpenseState = {
    expenses: [],
    isLoading: true
};

const expenseReducer = (state = expenseDefaultState, action: ExpenseActions): ExpenseState => {
    switch (action.type) {
        case "SAVE_EXPENSES":
            return produce(state, draft => {
                action.payload.forEach(expense =>
                    draft.expenses.push(expense)
                );
                draft.isLoading = false
            });
        case "UPDATE_EXPENSE_COMMENT":
            return produce(state, draft => {
                const updatedExpense = draft["expenses"].find(exp => exp.index === action.payload.index);
                if (updatedExpense) {
                    updatedExpense.comment = action.payload.comment
                }
            });
        default:
            return state
    }
};
export {expenseReducer}
