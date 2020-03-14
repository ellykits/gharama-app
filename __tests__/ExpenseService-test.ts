import {Expense} from "../common/common-types";

import 'react-native';
import ExpenseService from "../services/expense-service";
import fetch from 'jest-fetch-mock'

const expenseService = new ExpenseService();

beforeEach(() => {
    fetch.resetMocks();
});

export const expenses: Expense[] = [
    {
        id: '5b995dff2e3cb74644948a66',
        amount: {
            value: 2149.29,
            currency: 'GBP'
        },
        date: '2017-06-21T08:45:09.326Z',
        merchant: 'QUONK',
        receipts: [],
        comment: '',
        category: '',
        user: {
            first: 'Atkins',
            last: 'Blackburn',
            email: 'atkins.blackburn@pleo.io'
        },
        index: 0
    },
    {
        id: '5b995dffdeec40464bd614bf',
        amount: {
            value: 731.92,
            currency: 'EUR'
        },
        date: '2017-05-30T14:12:31.054Z',
        merchant: 'WRAPTURE',
        receipts: [],
        comment: '',
        category: '',
        user: {
            first: 'Barbara',
            last: 'Downs',
            email: 'barbara.downs@pleo.io'
        },
        index: 1
    },
];

const expense: Expense = {
    id: '5b995d998deec40464bd614bf',
    amount: {
        value: 3000,
        currency: 'KES'
    },
    receipts: [
        {url: '/receipts/5b996064dfd5b783915112f5-0'}
    ],
    merchant: "Citadel",
    user: {
        first: 'Rick',
        last: 'Sanchez',
        email: 'wabalabadabdub@ricksanchex.galaxy'
    },
    category: '',
    index: 3,
    date: '2020-05-30T18:11:56.054Z',
    comment: '',
};

it('fetches expenses from the endpoint', () => {
    fetch.mockResponseOnce(JSON.stringify(expenses));
    const onResponse = jest.fn();
    const onError = jest.fn();
    return expenseService.fetchExpenses(0, 30)
        .then(onResponse)
        .catch(onError)
        .finally(() => {
            expect(onResponse).toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
            expect(onResponse.mock.calls[0][0][0]).toEqual(expenses[0]);
        });
});

it('uploads receipts to the server', () => {
    expenseService.uploadReceipt()
});
