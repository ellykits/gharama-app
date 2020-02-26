import {createStore, compose, applyMiddleware} from 'redux'
import {expensesReducers} from './reducers'
import {createLogger} from 'redux-logger';

export const store = createStore(
    expensesReducers,
    compose(
        applyMiddleware(createLogger({collapsed: false, logErrors: true}))
    ));

export type AppState = ReturnType<typeof expensesReducers>
