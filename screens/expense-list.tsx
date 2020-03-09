import React, {Component} from 'react';
import {
    ActivityIndicator,
    FlatList,
    NativeEventEmitter,
    NativeModules,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ItemSeparator from "../components/item-separator";
import {Expense} from "../common/common-types";
import {connect} from "react-redux";
import ExpenseService from "../services/expense-service";
import {AppState} from "../store";
import moment from "moment";

interface Props {
    componentId: string;
    expenses: Expense[]
    isLoading: boolean
}

interface State {
    filterText: string
    filteredExpenses: Expense []
}

class ExpenseList extends Component<Props, State> {

    private expenseService = new ExpenseService();

    constructor(props: Props) {
        super(props);
        this.state = {filteredExpenses: this.props.expenses, filterText: ''}
    }

    componentDidMount(): void {
        this.expenseService.fetchExpenses()
            .then(expenses => {
                this.expenseService.dispatchSaveExpenses(expenses);
                this.setState({filteredExpenses: expenses})
            }).catch(error => console.log(error));

        const eventEmitter = new NativeEventEmitter(NativeModules.ExpenseDetailsModule);
        eventEmitter.addListener('UploadImageEvent', (event) => {
            console.log(event);
            this.expenseService.uploadReceipt(event.file_name, event.id, (expense => {
                if (expense !== null) {
                    this.expenseService.dispatchUpdateExpenseReceipt(expense);
                    NativeModules.ReceiptsModule.displayReceipts(expense);
                }
                NativeModules.ReceiptsModule.showToastMessage(expense !== null)
            }));
        });
        eventEmitter.addListener('PostCommentEvent', (event) => {
            console.log(event);
            this.expenseService.dispatchUpdateExpenseComment(event.id, event.comment);
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

    private bindItem(data: Expense) {
        return (
            <TouchableOpacity onPress={() => ExpenseList.onPress(data)}>
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

    private static onPress(item: Expense) {
        NativeModules.ExpenseDetailsModule.displayExpenseDetails(item);
    }

    private filterExpenses(text: string) {
        this.setState({filteredExpenses: this.props.expenses, filterText: text.toLowerCase().trim()});
        const currentExpenses = this.state.filteredExpenses.filter(expense => {
            return expense.merchant.toLowerCase().trim().match(this.state.filterText);
        });
        this.setState({filteredExpenses: currentExpenses})
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
                <View style={styles.searchWrapper}>
                    <TextInput
                        onChangeText={this.filterExpenses.bind(this)}
                        placeholder={"Search by merchant/user"}
                        style={styles.search}/>
                </View>

                <FlatList
                    ItemSeparatorComponent={ItemSeparator}
                    data={this.state.filteredExpenses}
                    renderItem={data => this.bindItem(data.item)}
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
    },
    search: {
        padding: 14,
        marginStart: 8,
        fontSize: 16
    },
    searchWrapper: {
        backgroundColor: '#F3F4F5',
    },
});


const mapStateToProps = (appState: AppState) => {
    return {expenses: appState.expenseState.expenses, isLoading: appState.expenseState.isLoading}
};

export default connect(mapStateToProps)(ExpenseList)
