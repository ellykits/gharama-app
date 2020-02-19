import {StyleSheet, View} from 'react-native';
import React from 'react';

export default class ItemSeparator extends React.Component {
  render() {
    return <View style={styles.itemSeparator} />;
  }
}

const styles = StyleSheet.create({
  itemSeparator: {
    height: 1,
    width: '100%',
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: '#e5e5e5',
  },
});
