/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {View} from 'react-native';

import {ExpenseList} from 'components';

const App: () => React$Node = () => (
  <View>
    <ExpenseList />
  </View>
);

export default App;
