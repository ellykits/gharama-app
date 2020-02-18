import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NativeImagePicker from '../modules/NativeImagePicker';
import ExpenseService from 'services/expense-service';

export default class ExpenseDetails extends Component {
  static get options() {
    return {
      statusBar: {
        visible: true,
        style: 'light',
      },
      topBar: {
        title: {
          color: 'white',
          fontWeight: 'bold',
          leftButtonColor: 'white',
          rightButtonColor: 'white',
        },
        animate: false,
        background: {
          color: '#ED5666',
          translucent: false,
        },
        backButton: {
          color: 'white',
        },
      },
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      expense: this.props.expense,
      comment: this.props.expense.comment,
    };
  }

  _postComment() {
    ExpenseService.prototype.postComment(this.props.expense.id, {
      comment: this.state.comment,
    });
  }

  _addReceipt() {
    NativeImagePicker.pickImage()
      .then(filePath => {
        console.log(`Uploaded image path => ${filePath}`);
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.body}>
          <ScrollView style={styles.content}>
            <Text style={styles.header}>Details</Text>
            <View style={styles.itemRow}>
              <Text style={styles.itemStart}>MERCHANT</Text>
              <Text style={styles.itemEnd}>{this.props.expense.merchant}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemStart}>CATEGORY</Text>
              <Text style={styles.itemEnd}>
                {this.props.expense.category !== ''
                  ? this.props.expense.category
                  : 'Uncategorized'}
              </Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemStart}>USER</Text>
              <Text style={styles.itemEnd}>
                {this.props.expense.user.first} {this.props.expense.user.last}
              </Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemStart}>USER EMAIL</Text>
              <Text style={styles.itemEnd}>
                {this.props.expense.user.email}
              </Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemStart}>AMOUNT</Text>
              <Text style={styles.itemEnd}>
                {this.props.expense.amount.currency}{' '}
                {this.props.expense.amount.value}
              </Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemStart}>DATE</Text>
              <Text style={styles.itemEnd}>
                {moment().format('YYYY-MM-DD', this.props.expense.date)}
              </Text>
            </View>
            <Text style={styles.header}>Comment</Text>
            <Text style={styles.comment}>
              {this.props.expense.comment === ''
                ? 'No comment'
                : this.props.expense.comment}
            </Text>
            <Text style={styles.header}>Receipts</Text>
          </ScrollView>

          <View style={styles.comment_box}>
            <View style={styles.cam_container}>
              {
                <TouchableOpacity onPress={() => this._addReceipt()}>
                  <View>
                    <Icon name="photo-camera" size={30} color="#ED5666" />
                  </View>
                </TouchableOpacity>
              }
            </View>
            <TextInput
              style={styles.text_field}
              multiline={true}
              onChangeText={comment => this.setState({comment})}
              value={this.state.comment}
              placeholder="Type your comment here..."
            />
            <View style={styles.button_container}>
              {
                <TouchableOpacity onPress={() => this._postComment()}>
                  <View>
                    <Text style={styles.post_button_text}>POST</Text>
                  </View>
                </TouchableOpacity>
              }
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    alignSelf: 'stretch',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginStart: 32,
    marginEnd: 32,
  },
  itemStart: {
    marginStart: 8,
    fontSize: 16,
    color: '#696969',
  },
  itemEnd: {
    marginEnd: 8,
    fontSize: 16,
    color: '#696969',
  },
  separator: {
    marginTop: 16,
  },
  header: {
    margin: 16,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 18,
    color: '#BE4552',
  },
  comment: {
    margin: 16,
    lineHeight: 30,
    textAlign: 'center',
  },
  body: {
    flex: 9,
  },
  content: {
    flex: 8,
    flexDirection: 'column',
    padding: 8,
  },
  comment_box: {
    flex: 0.1,
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    justifyContent: 'space-between',
  },
  cam_container: {
    flex: 2,
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  button_container: {
    flex: 2,
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  text_field: {
    height: 60,
    flex: 8,
  },
  post_button_text: {
    color: '#ED5666',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
