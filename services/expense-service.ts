import {Expense} from "../common/common-types";

interface Comment {
    comment: string;
}

export default class ExpenseService {

    private URL = 'http://10.0.2.2:3000/expenses';

    async _performPostRequest(url: string, payload: Comment) {
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(result => Promise.resolve(result))
            .catch(err => console.log(err));
    }

    postComment(expenseId: string, comment: Comment) {
        this._performPostRequest(`${this.URL}/${expenseId}`, comment)
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }

    async getExpenses(): Promise<Expense[]> {
        return await fetch(this.URL, {method: 'GET'}).then(response => response.json()).then(result => result.expenses)
    }
}
