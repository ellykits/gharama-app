import {
    LOAD_MORE_EXPENSES,
    AppActions,
    SAVE_EXPENSES,
    UPDATE_EXPENSE_COMMENT,
    UPDATE_EXPENSE_RECEIPT
} from "../common/redux-types";
import {Expense} from "../common/common-types";

export const saveExpensesAction = (expenses: Expense[], total: number): AppActions => ({
    type: SAVE_EXPENSES,
    payload: {expenses: expenses, total: total},
});

export const updateExpenseCommentAction = (id: string, comment: string): AppActions => ({
    type: UPDATE_EXPENSE_COMMENT,
    payload: {id, comment},
});

export const updateExpenseReceipt = (expense: Expense): AppActions => ({
    type: UPDATE_EXPENSE_RECEIPT,
    payload: expense
});

export const loadMoreExpenses = (expenses: Expense[]): AppActions => ({
   type: LOAD_MORE_EXPENSES,
   payload: expenses
});

