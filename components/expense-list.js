import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
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
      topBar: {
        title: {
          text: 'Expenses',
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
    this.state = {expenses: [], isLoading: true};
  }

  componentDidMount() {
    if (this.state.expenses.length === 0) {
      this._getExpenses();
    }
  }

  _getExpenses() {
    fetch('http://10.0.2.2:3000/expenses', {method: 'GET'})
      .then(response => response.json())
      .then(jsonResponse => {
        let list = jsonResponse.expenses;
        list.sort((a, b) => (a.merchant > b.merchant ? 1 : -1));
        this.setState({expenses: jsonResponse.expenses, isLoading: false});
      })
      .catch(error => console.log(error));
  }

  FlatListItemSeparator = () => <View style={styles.itemSeparator} />;

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
          <Text style={styles.item}>
            {data.item.category !== '' ? data.item.category : 'Uncategorized'}{' '}
            {moment().format('YYYY-MM-DD', data.item.date)}
          </Text>
          <View style={styles.itemRow}>
            <Text style={styles.item}>
              Expense for {data.item.user.first} {data.item.user.last}
            </Text>
            <Text style={styles.itemEnd}>
              {data.item.category === '' ? '(No comment)' : 'Comment (1)'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _onPress(item) {
    const {first, last} = item.user;
    let {merchant} = item;
    let pageTitle = `${first.toString()} ${last.toString()} (${merchant.toLowerCase()})`;

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
          ItemSeparatorComponent={this.FlatListItemSeparator}
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
    backgroundColor: 'white',
    marginVertical: 8,
    marginStart: 0,
    marginEnd: 8,
    borderLeftWidth: 8,
    borderLeftColor: '#66BB6A',
  },
  item: {
    fontSize: 14,
    padding: 8,
    color: '#696969',
  },
  itemSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
  },
  itemRow: {
    flex: 1,
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
    backgroundColor: '#fff',
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
});
