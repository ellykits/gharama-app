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
import ItemSeparator from "../components/item-separator";
import {Expense} from "../common/common-types";
import ExpenseService from "../services/expense-service";

interface Props {
    componentId: string;
}

interface State {
    expenses: Expense[];
    isLoading: boolean;
}

export default class ExpenseList extends Component<Props, State> {
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

    expenseService = new ExpenseService();

    constructor(props: Props) {
        super(props);
        this.state = {expenses: [], isLoading: true};
    }

    componentDidMount() {
        this.expenseService.getExpenses()
            .then(expenses => {
                this.setState({expenses: expenses, isLoading: false});
            })
            .catch(error => console.log(error));
    }

    _bindItem(data: Expense) {
        return (
            <TouchableOpacity onPress={() => this._onPress(data)}>
                <View style={styles.itemWrapper}>
                    <View style={styles.itemRow}>
                        <Text style={[styles.itemStart, styles.merchant]}>
                            {data.merchant}
                        </Text>
                        <Text style={[styles.itemEnd, styles.amount]}>
                            {data.amount.currency} {data.amount.value}
                        </Text>
                    </View>
                    <Text style={[styles.itemRow, styles.item]}>
                        {data.category !== '' ? data.category : 'Uncategorized'}{' '}
                        {moment(data.date).format('YYYY-MM-DD')}
                    </Text>
                    <View style={styles.itemRow}>
                        <Text style={styles.item}>
                            Expense for {data.user.first} {data.user.last}
                        </Text>
                        <Text style={[styles.itemEnd, styles.comment]}>
                            {data.category === '' ? '(No comment)' : 'Comment (1)'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _onPress(item: Expense) {
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
                    <ActivityIndicator size="large" color="#0c9"/>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <FlatList
                    ItemSeparatorComponent={ItemSeparator}
                    data={this.state.expenses}
                    renderItem={data => this._bindItem(data.item)}
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
