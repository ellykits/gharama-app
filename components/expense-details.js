import React, {Component} from 'react';
import {Text, View} from 'react-native';

export default class ExpenseDetails extends Component {
  static get options() {
    return {
      topBar: {
        title: {
          color: 'white',
          fontWeight: 'bold',
        },
        background: {
          color: '#ED5666',
          translucent: false,
        },
      },
    };
  }
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>{this.props.expense.merchant}</Text>
      </View>
    );
  }
}
