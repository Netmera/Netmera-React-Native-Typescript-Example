import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../Colors';

const AutoTracking = ({navigation}: any) => {
  const buttons = [
    {name: 'AUTOTRACK TEST', route: 'AutoTrackTest'},
    {name: 'AUTOTRACK FLATLIST', route: 'AutoTrackFlatListTest'},
    {name: 'STACK NAV TEST', route: 'StackNavTest'},
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {buttons.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            activeOpacity={0.6}
            onPress={() => navigation.navigate(item.route)}>
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    marginBottom: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },
  text: {
    fontWeight: '600',
    fontSize: 13,
    color: Colors.white,
  },
});

export default AutoTracking;
