import {Navigation} from 'react-native-navigation';
import {ExpenseDetails, ExpenseList} from 'components';

export function registerScreens() {
  Navigation.registerComponent('ExpenseDetails', () => ExpenseDetails);
  Navigation.registerComponent('Expenses', () => ExpenseList);
}
