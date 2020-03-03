import React, {Component} from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform, ScrollView,
} from 'react-native';
import ImageView from 'react-native-image-viewing'
import {ImageItem} from "../common/common-types";

const {width} = Dimensions.get('window');

interface ReceiptProps {
    receipts: ImageItem[]
}

interface ReceiptState {
    imageIndex: number,
    isImageVisible: boolean
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        paddingTop: Platform.select({ios: 0, android: 10}),
    },
    image: {
        width, height: 240,
        margin: 4
    }
});

export default class ExpenseReceipt extends Component<ReceiptProps, ReceiptState> {

    constructor(props: ReceiptProps) {
        super(props);
        this.state = {imageIndex: 0, isImageVisible: false,};
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

    render() {

        const {isImageVisible, imageIndex} = this.state;

        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.props.receipts.map((image, index) => (
                        <TouchableOpacity
                            key={image.title}
                            onPress={() => {
                                this.setState({imageIndex: index, isImageVisible: true,});
                            }}
                        >
                            <Image
                                style={styles.image}
                                source={image.source}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <ImageView
                    images={this.props.receipts.map(item => item.source)}
                    imageIndex={imageIndex}
                    animationType="slide"
                    visible={isImageVisible}
                    doubleTapToZoomEnabled={ true}
                    onRequestClose={() => this.setState({isImageVisible: false})}
                />
            </View>
        );
    }
}
