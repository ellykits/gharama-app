import {ExpenseActions, ExpenseState} from "../common/redux-types";
import {produce} from "immer";
import {Expense} from "../common/common-types";

const expenseDefaultState: ExpenseState = {
    expenses: [],
    isLoading: true
};

function findExpense(draft: ExpenseState, id: string): Expense | undefined {
    return draft["expenses"].find(exp => exp.id === id);
}

const expenseReducer = (state = expenseDefaultState, action: ExpenseActions): ExpenseState => {
    switch (action.type) {
        case "SAVE_EXPENSES":
            return produce(state, draft => {
                draft.expenses = [];
                action.payload.forEach(expense =>
                    draft.expenses.push(expense)
                );
                draft.isLoading = false
            });
        case "UPDATE_EXPENSE_COMMENT":
            return produce(state, draft => {
                const updatedExpense = findExpense(draft, action.payload.id);
                if (updatedExpense) {
                    updatedExpense.comment = action.payload.comment
                }
            });
        case "UPDATE_EXPENSE_RECEIPT":
            return produce(state, draft => {
                const updatedExpense = findExpense(draft, action.payload.id);
                if (updatedExpense) {
                    action.payload.receipts.forEach(receipt =>
                        updatedExpense.receipts.push(receipt)
                    );
                }
            });
        default:
            return state
    }
};
export {expenseReducer}
