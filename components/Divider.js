import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = () => {
  return (
    <View style={styles.divider} />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1, // equivalent to p-[1px] in Tailwind for height
    width: '100%', // w-full in Tailwind
    backgroundColor: '#e2e8f0',  // This color corresponds to Tailwind's bg-neutral-200
  }
});

export default Divider;