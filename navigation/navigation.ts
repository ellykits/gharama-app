import {Navigation} from 'react-native-navigation';
import ExpenseList from "../screens/expense-list";
import {store} from "../store";
import {Provider} from "react-redux";

export function registerScreens() {
    Navigation.registerComponentWithRedux("Expenses", () => ExpenseList, Provider, store);
}
