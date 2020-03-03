import {Expense} from "./common-types";

export const SAVE_EXPENSES = 'SAVE_EXPENSES';
export const UPDATE_EXPENSE_COMMENT = 'UPDATE_EXPENSE_COMMENT';

export interface SaveExpensesAction {
    type: typeof SAVE_EXPENSES
    payload: Expense []
    meta?: object
}

export interface UpdateExpenseCommentAction {
    type: typeof UPDATE_EXPENSE_COMMENT
    payload: { index: number, comment: string }
    meta?: object
}

export interface ExpenseState {
    expenses: Expense []
    isLoading: boolean
}

export type ExpenseActions = SaveExpensesAction | UpdateExpenseCommentAction

export type AppActions = ExpenseActions
