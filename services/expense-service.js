const URL = 'http://192.168.88.236:3000/expenses';

export default class ExpenseService {
  async _performPostRequest(url, payload) {
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

  postComment(expenseId, comment) {
    this._performPostRequest(`${URL}/${expenseId}`, comment)
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }
}
