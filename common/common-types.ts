export interface Expense {
    id: string
    category: string
    comment: string
    date: string
    merchant: string
    amount: Amount
    user: User
    receipts: Receipt[]
    index: number
}

interface Amount {
    value: number
    currency: string
}

interface User {
    first: string
    last: string
    email: string
}

interface Receipt {
    url: string
}
