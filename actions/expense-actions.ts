import {AppActions, SAVE_EXPENSES, UPDATE_EXPENSE_COMMENT} from "../common/redux-types";
import {Expense} from "../common/common-types";

const URL = 'http://10.0.2.2:3000/expenses';

export const saveExpensesAction = (expenses: Expense[]): AppActions => ({
    type: SAVE_EXPENSES,
    payload: expenses,
});


export const updateExpenseCommentAction = (index: number, comment: string): AppActions => ({
    type: UPDATE_EXPENSE_COMMENT,
    payload: {index, comment},
});

