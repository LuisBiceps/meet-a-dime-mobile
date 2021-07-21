import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Label = ({ text, ...restProps }) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#b39bc8',
    borderRadius: 4,
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
});

export default memo(Label);
