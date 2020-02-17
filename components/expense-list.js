import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {ItemSeparator} from 'components';
import moment from 'moment';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class ExpenseList extends Component {
  static get options() {
    return {
      statusBar: {
        visible: true,
        style: 'light',
      },
      topBar: {
        title: {
          text: 'EXPENSES',
          color: 'white',
          fontWeight: 'bold',
        },
        animate: false,
        background: {
          color: '#ED5666',
          translucent: false,
        },
      },
    };
  }

  constructor(props) {
    super(props);
    this.state = {expenses: [], isLoading: true};
  }

  componentDidMount() {
    if (this.state.expenses.length === 0) {
      this._getExpenses();
    }
  }

  _getExpenses() {
    fetch('http://192.168.88.236:3000/expenses', {method: 'GET'})
      .then(response => response.json())
      .then(jsonResponse => {
        let list = jsonResponse.expenses;
        list.sort((a, b) => (a.merchant > b.merchant ? 1 : -1));
        this.setState({expenses: jsonResponse.expenses, isLoading: false});
      })
      .catch(error => console.log(error));
  }

  _bindItem(data) {
    return (
      <TouchableOpacity onPress={() => this._onPress(data.item)}>
        <View style={styles.itemWrapper}>
          <View style={styles.itemRow}>
            <Text style={[styles.itemStart, styles.merchant]}>
              {data.item.merchant}
            </Text>
            <Text style={[styles.itemEnd, styles.amount]}>
              {data.item.amount.currency} {data.item.amount.value}
            </Text>
          </View>
          <Text style={[styles.itemRow, styles.item]}>
            {data.item.category !== '' ? data.item.category : 'Uncategorized'}{' '}
            {moment().format('YYYY-MM-DD', data.item.date)}
          </Text>
          <View style={styles.itemRow}>
            <Text style={styles.item}>
              Expense for {data.item.user.first} {data.item.user.last}
            </Text>
            <Text style={[styles.itemEnd, styles.comment]}>
              {data.item.category === '' ? '(No comment)' : 'Comment (1)'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _onPress(item) {
    let {merchant} = item;
    let pageTitle = `${merchant.toUpperCase()} EXPENSE`;

    Navigation.push(this.props.componentId, {
      component: {
        name: 'ExpenseDetails',
        passProps: {
          expense: item,
        },
        options: {
          topBar: {
            title: {
              text: pageTitle,
            },
          },
        },
      },
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      );
    }
    return (
      <View view={styles.container}>
        <FlatList
          ItemSeparatorComponent={ItemSeparator}
          data={this.state.expenses}
          renderItem={item => this._bindItem(item)}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    marginVertical: 2,
    marginStart: 0,
    marginEnd: 8,
    borderLeftWidth: 8,
    borderLeftColor: '#63CCF2',
  },
  item: {
    fontSize: 14,
    padding: 8,
    color: '#696969',
  },
  itemSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#c7c7c7',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemStart: {
    alignSelf: 'flex-start',
    marginStart: 8,
  },
  itemEnd: {
    alignSelf: 'flex-end',
    marginEnd: 8,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  list: {
    paddingVertical: 4,
    margin: 4,
    backgroundColor: '#fff',
  },
  merchant: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4A4A4A',
  },
  amount: {
    color: '#696969',
    fontWeight: 'bold',
    fontSize: 16,
  },
  comment: {
    color: '#696969',
  },
});
