import {store} from "../store";
import {saveExpensesAction, updateExpenseCommentAction, updateExpenseReceipt} from "../actions/expense-actions";
import {Expense} from "../common/common-types";
import moment from "moment";

export default class ExpenseService {

    private URL = 'http://10.0.2.2:3000/expenses';

    async fetchExpenses(): Promise<Expense[]> {
        return await fetch(this.URL, {method: 'GET'})
            .then(response => response.json())
            .then(result => result.expenses)
    }

    uploadReceipt(filePath: string, id: string, uploadReceiptCallback: (expense: Expense | null) => void) {
        const formData = new FormData();
        formData.append('name', 'receipt');
        formData.append('receipt', {
            uri: `file://${filePath}`,
            name: `${id}${moment().unix()}`,
            type: 'image/jpg'
        });

        fetch(`${this.URL}/${id}/receipts`, {
            method: 'post',
            body: formData,
        })
            .then(response => response.json())
            .then(response => {
                console.log('upload success', response);
                uploadReceiptCallback(response)
            })
            .catch(error => {
                console.error('upload error', error);
                uploadReceiptCallback(null)
            });
    }

    dispatchSaveExpenses(expenses: Expense[]) {
        store.dispatch(saveExpensesAction(expenses))
    }

    dispatchUpdateExpenseComment(id: string, comment: string) {
        store.dispatch(updateExpenseCommentAction(id, comment))
    }

    dispatchUpdateExpenseReceipt(expense: Expense) {
        store.dispatch(updateExpenseReceipt(expense))
    }
}
