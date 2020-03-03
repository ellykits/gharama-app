import {combineReducers} from 'redux'
import {expenseReducer} from './expense-reducers'

export const expensesReducers = combineReducers({expenseState: expenseReducer});
