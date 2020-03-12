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
    total: number
    isLoading: boolean
}

interface State {
    filteredExpenses: Expense []
    offset: number
    limit: number
    isFetchingData: boolean
    total: number
}

class ExpenseList extends Component<Props, State> {

    private expenseService = new ExpenseService();

    constructor(props: Props) {
        super(props);
        this.state = {
            filteredExpenses: this.props.expenses,
            offset: 0,
            limit: 30,
            isFetchingData: false,
            total: this.props.total
        }
    }

    componentDidMount(): void {

        let {limit, offset} = this.state;
        this.retrieveExpenses(offset, limit, false);

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

    private retrieveExpenses(offset: number, limit: number, loadMore: boolean) {
        this.expenseService.fetchExpenses(offset, limit)
            .then(expenseResponse => {
                if (loadMore) {
                    this.expenseService.dispatchLoadMoreExpenses(expenseResponse.expenses);
                    this.setState({
                        total: expenseResponse.total,
                        filteredExpenses: [...this.state.filteredExpenses, ...expenseResponse.expenses],
                        isFetchingData: false
                    })
                } else {
                    this.expenseService.dispatchSaveExpenses(expenseResponse.expenses, expenseResponse.total);
                    this.setState({total: expenseResponse.total, filteredExpenses: expenseResponse.expenses})
                }
            }).catch(error => console.log(error));
    }

    private loadMoreExpenses = () => {
        this.setState({isFetchingData: true}, () => {
            const {limit, offset, total} = this.state;
            let newOffset = offset + limit;
            this.setState({offset: newOffset}, () => {
                if (newOffset < total) {
                    this.retrieveExpenses(this.state.offset, this.state.limit, true);
                }
            })
        });
    };

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

    private renderFooter() {
        const {isFetchingData, total, offset, limit} = this.state;
        if ((offset + limit) < total) {
            return (
                <View style={styles.footer}>
                    <Text style={styles.counter}>{offset + limit} of {total} expenses</Text>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={this.loadMoreExpenses}
                        style={styles.loadMoreBtn}>
                        <Text style={styles.btnText}>Load more expenses</Text>
                        {isFetchingData ? (
                            <ActivityIndicator color="#F06292" style={{marginLeft: 8}}/>
                        ) : null}
                    </TouchableOpacity>
                </View>
            );
        } else {
            return null;
        }
    }

    private static onPress(item: Expense) {
        NativeModules.ExpenseDetailsModule.displayExpenseDetails(item);
    }

    private static getMatch(firstString: string, secondString: string) {
        return firstString.toLowerCase().trim().match(secondString.trim().toLowerCase());
    }

    private filterExpenses = (text: string) => {
        const currentExpenses = this.props.expenses.filter(expense => {
            return ExpenseList.getMatch(expense.merchant, text) || ExpenseList.getMatch(expense.user.last, text) ||
                ExpenseList.getMatch(expense.user.first, text)
        });
        this.setState({filteredExpenses: currentExpenses});
    };

    render() {
        if (this.props.isLoading) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#F06292"/>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.searchWrapper}>
                    <TextInput
                        onChangeText={text => this.filterExpenses(text)}
                        placeholder={"Search by merchant/user"}
                        style={styles.search}/>
                </View>

                <FlatList
                    ItemSeparatorComponent={ItemSeparator}
                    data={this.state.filteredExpenses}
                    renderItem={data => this.bindItem(data.item)}
                    keyExtractor={item => item.id.toString()}
                    ListFooterComponent={this.renderFooter.bind(this)}
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
    footer: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    counter: {
        flex: 1,
        padding: 8,
        color: '#696969',
    },
    loadMoreBtn: {
        flex:1,
        padding: 10,
        borderColor: '#F06292',
        borderRadius: 4,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: '#F06292',
        fontSize: 16,
        textAlign: 'center',
    },

});


const mapStateToProps = (appState: AppState) => {
    const {expenses, isLoading, total} = appState.expenseState;
    return {expenses: expenses, isLoading: isLoading, total: total}
};

export default connect(mapStateToProps)(ExpenseList)
