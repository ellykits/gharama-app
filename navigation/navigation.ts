import {Navigation} from 'react-native-navigation';
import ExpenseDetails from "../screens/expense-details";
import ExpenseList from "../screens/expense-list";

export function registerScreens() {
  Navigation.registerComponent('ExpenseDetails', () => ExpenseDetails);
  Navigation.registerComponent('Expenses', () => ExpenseList);
}
