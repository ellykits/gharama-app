/**
 * Dapani app
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {ReactNode} from 'react';
import {View} from 'react-native';
import ExpenseList from "./screens/expense-list";

const App: () => ReactNode = () => (
  <View>
    <ExpenseList componentId={"Expense"}/>
  </View>
);

export default App;
