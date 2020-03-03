import {ImageSource} from "react-native-image-viewing/dist/@types";

export interface Expense {
    id: string
    category: string
    comment: string
    date: string
    merchant: string
    amount: Amount
    user: User
    receipts: String[]
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

/**
 * Types for Image Viewer
 */
export interface ImageItem {
    width?: number,
    height?: number
    source: ImageSource,
    title?: string | number
}
