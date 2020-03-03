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
import {Expense, ImageItem} from "../common/common-types";
import {connect} from "react-redux";
import ExpenseService from "../services/expense-service";
import {AppState} from "../store";
import {NativeModules} from 'react-native';
import moment from "moment";
import {Navigation} from "react-native-navigation";

interface Props {
    componentId: string;
    expenses: Expense[]
    isLoading: boolean
}

class ExpenseList extends Component<Props> {

    private expenseService = new ExpenseService();

    private receipts: ImageItem[] = [

        {
            source: {uri: "https://stimg.cardekho.com/images/carexteriorimages/360x240/Ferrari/Ferrari-Portofino/047.jpg"},
            title: "Title two"
        },
        {
            source: {uri: "https://rollr.io/wp-content/uploads/2017/02/mini-home-car.jpg"},
            title: "Title three"
        },
        {
            source: {
                uri: "https://www.bmw-speedmotorwagen.in/sites/default/files/styles/nostyle/public/slider_banner_image/2018-02/M4Coupe-Header_Banner_17.jpg?itok=zmJWURhi"
            },
            title: "Title four"
        },
        {
            source: {
                uri: "https://img.etimg.com/thumb/msid-67103187,width-1200,height-900,resizemode-4,imgsize-96644/car-getty.jpg"
            },
            title: "Title fiv"
        },
        {
            source: {uri: "https://hips.hearstapps.com/amv-prod-cad-assets.s3.amazonaws.com/vdat/submodels/dodge_challenger_dodge-challenger_2019-1545059179866.jpg"},
            title: "Title siz"
        }
    ];

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
            console.log(event);
        });
        eventEmitter.addListener('PostCommentEvent', (event) => {
            console.log(event);
            this.expenseService.dispatchUpdateExpenseComment(event.index, event.comment);
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

    _navigateToReceiptsPage(item: Expense) {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'ExpenseReceipts',
                passProps: {
                    receipts: this.receipts,
                },
                options: {
                    topBar: {
                        visible: true,
                        title: {
                            text: `${item.merchant} RECEIPTS`
                        },
                        backButton: {
                            color: "#ffffff"
                        }
                    },
                },
            },
        });
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
