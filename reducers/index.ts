import {combineReducers} from 'redux'
import {expenseReducer} from './fetch-expenses-reducer'

export const expensesReducers = combineReducers({expenseState: expenseReducer});
