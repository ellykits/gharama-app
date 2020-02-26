import {Navigation} from 'react-native-navigation';
import ExpenseDetails from "../screens/expense-details";
import ExpenseList from "../screens/expense-list";
import {store} from "../store";
import {Provider} from "react-redux";

export function registerScreens() {
    Navigation.registerComponentWithRedux("ExpenseDetails", () => ExpenseDetails, Provider, store);
    Navigation.registerComponentWithRedux("Expenses", () => ExpenseList, Provider, store);
}
