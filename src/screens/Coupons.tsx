import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../Colors';
import {Netmera} from 'react-native-netmera';

const Coupons = () => {
  const [page, setPage] = useState<string>('');
  const [max, setMax] = useState<string>('');

  const onFetchCouponsPress = () => {
    if (page && max) {
      //TODO: catch and then statement will be added
      Netmera.fetchCoupons(Number(page), Number(max));
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.content}>
        <View style={styles.inputArea}>
          <TextInput
            value={page}
            onChangeText={setPage}
            placeholder={'Page'}
            style={styles.placeholder}
          />
          <View style={styles.divider} />
        </View>
        <View style={styles.inputArea}>
          <TextInput
            value={max}
            onChangeText={setMax}
            placeholder={'Max'}
            style={styles.placeholder}
          />
          <View style={styles.divider} />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onFetchCouponsPress}>
        <Text style={styles.buttonText}>FETCH COUPONS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    borderRadius: 4,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: Colors.primary,
  },

  buttonText: {
    fontWeight: '600',
    fontSize: 13,
    color: Colors.white,
  },

  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  divider: {
    height: 1,
    backgroundColor: Colors.black,
    opacity: 0.6,
    paddingHorizontal: 50,
  },

  inputArea: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  placeholder: {
    fontWeight: '400',
    fontSize: 15,
    color: Colors.black,
    opacity: 0.7,
  },
});

export default Coupons;
