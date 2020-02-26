import {Expense} from "./common-types";

export const SAVE_EXPENSES = 'SAVE_EXPENSES';

export interface SaveExpensesAction {
    type: typeof SAVE_EXPENSES
    payload: Expense []
    meta?: object
}

export interface ExpenseState {
    expenses: Expense []
    isLoading: boolean
}

export type ExpenseActions = SaveExpensesAction

export type AppActions = ExpenseActions
