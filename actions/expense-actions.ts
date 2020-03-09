import {AppActions, SAVE_EXPENSES, UPDATE_EXPENSE_COMMENT, UPDATE_EXPENSE_RECEIPT} from "../common/redux-types";
import {Expense} from "../common/common-types";

export const saveExpensesAction = (expenses: Expense[]): AppActions => ({
    type: SAVE_EXPENSES,
    payload: expenses,
});

export const updateExpenseCommentAction = (id: string, comment: string): AppActions => ({
    type: UPDATE_EXPENSE_COMMENT,
    payload: {id, comment},
});

export const updateExpenseReceipt = (expense: Expense): AppActions => ({
    type: UPDATE_EXPENSE_RECEIPT,
    payload: expense
});

