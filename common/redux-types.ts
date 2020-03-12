import {Expense} from "./common-types";
import exp from "constants";

export const SAVE_EXPENSES = 'SAVE_EXPENSES';
export const UPDATE_EXPENSE_COMMENT = 'UPDATE_EXPENSE_COMMENT';
export const UPDATE_EXPENSE_RECEIPT = 'UPDATE_EXPENSE_RECEIPT';
export const LOAD_MORE_EXPENSES = 'LOAD_MORE_EXPENSES';

export interface SaveExpensesAction {
    type: typeof SAVE_EXPENSES
    payload: { expenses: Expense [], total: number}
    meta?: object
}

export interface UpdateExpenseCommentAction {
    type: typeof UPDATE_EXPENSE_COMMENT
    payload: { id: string, comment: string }
    meta?: object
}

export interface UpdateExpenseReceiptAction {
    type: typeof UPDATE_EXPENSE_RECEIPT
    payload: Expense
    meta?: object
}

export interface AddMoreExpensesAction {
    type: typeof LOAD_MORE_EXPENSES
    payload: Expense[]
    meta?: object
}

export interface ExpenseState {
    expenses: Expense []
    total: number
    isLoading: boolean
}

export type ExpenseActions = SaveExpensesAction | UpdateExpenseCommentAction | UpdateExpenseReceiptAction | AddMoreExpensesAction

export type AppActions = ExpenseActions
