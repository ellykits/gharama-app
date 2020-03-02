import React, {Component} from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    NativeEventEmitter,
} from 'react-native';
import ItemSeparator from "../components/item-separator";
import {Expense} from "../common/common-types";
import {connect} from "react-redux";
import ExpenseService from "../services/expense-service";
import {AppState} from "../store";
import {NativeModules} from 'react-native';
import moment from "moment";

interface Props {
    componentId: string;
    expenses: Expense[]
    isLoading: boolean
}

class ExpenseList extends Component<Props> {

    private expenseService = new ExpenseService();

    constructor(props: Props) {
        super(props);
    }

    componentDidMount(): void {
        this.expenseService.fetchExpenses()
            .then(expenses => {
                this.expenseService.dispatchSaveExpenses(expenses);
            }).catch(error => console.log(error));

        const eventEmitter = new NativeEventEmitter(NativeModules.ExpenseDetailsModule);
        eventEmitter.addListener('UploadImageEvent', (event) => {
            console.log(event)
        });
        eventEmitter.addListener('PostCommentEvent', (event) => {
            console.log(event)
        });
    }

    static get options() {
        return {
            statusBar: {
                visible: true,
                style: 'light',
                backgroundColor: '#ba2d65'
            },
            topBar: {
                title: {
                    text: 'Expenses',
                    color: 'white',
                    fontWeight: 'bold',
                },
                animate: false,
                background: {
                    color: '#F06292',
                    translucent: false,
                },
            },
        };
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
                            {data.amount.value} {data.amount.currency}
                        </Text>
                    </View>
                    <View style={styles.itemRow}>
                        <Text style={styles.item}>
                            For {data.user.first} {data.user.last}
                        </Text>
                        <Text style={[styles.itemEnd, styles.date]}>{moment(data.date, 'YYYY-MM-DD').fromNow()}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _onPress(item: Expense) {
        NativeModules.ExpenseDetailsModule.displayExpenseDetails(item);
    }

    render() {
        if (this.props.isLoading) {
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
                    data={this.props.expenses}
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
        padding: 16,
    },
    item: {
        fontSize: 14,
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
        marginBottom: 16,
    },
    itemStart: {
        alignSelf: 'flex-start',
    },
    itemEnd: {
        alignSelf: 'flex-end',
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
        backgroundColor: '#fff',
    },
    merchant: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#4A4A4A',
    },
    amount: {
        color: '#696969',
        fontSize: 16,
    },
    comment: {
        color: '#696969',
    },
    date: {
        fontSize: 14,
        color: '#696969',
    }

});


const mapStateToProps = (appState: AppState) => {
    return {expenses: appState.expenseState.expenses, isLoading: appState.expenseState.isLoading}
};

export default connect(mapStateToProps)(ExpenseList)
