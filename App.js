/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {StatusBar} from 'react-native';

import {ExpenseList} from 'components';

const App: () => React$Node = () => (
  <>
    <StatusBar barStyle="dark-content" />
    <ExpenseList />
  </>
);

export default App;
