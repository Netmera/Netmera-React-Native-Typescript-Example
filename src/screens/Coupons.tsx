import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../Colors';
import {Netmera, NetmeraCouponObject} from 'react-native-netmera';
import Toast from 'react-native-toast-message';

const Coupons = () => {
  const [page, setPage] = useState<string>('');
  const [max, setMax] = useState<string>('');
  const [coupons, setCoupons] = useState<NetmeraCouponObject[]>([]);

  const onFetchCouponsPress = () => {
    if (page && max) {
      Netmera.fetchCoupons(Number(page), Number(max))
        .then(_coupons => {
          console.log(_coupons);
          setCoupons(_coupons);
        })
        .catch(error => {
          console.log(error.code, error.message);
          Toast.show({
            type: 'error',
            text1: error.message,
          });
        });
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
            placeholderTextColor={Colors.black}
            style={styles.placeholder}
          />
          <View style={styles.divider} />
        </View>
        <View style={styles.inputArea}>
          <TextInput
            value={max}
            onChangeText={setMax}
            placeholder={'Max'}
            placeholderTextColor={Colors.black}
            style={styles.placeholder}
          />
          <View style={styles.divider} />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onFetchCouponsPress}>
        <Text style={styles.buttonText}>FETCH COUPONS</Text>
      </TouchableOpacity>
      <FlatList
        data={coupons}
        ListEmptyComponent={
          <Text style={{color: Colors.black}}>No coupon found</Text>
        }
        renderItem={({item, index}) => {
          return (
            <View key={index}>
              <Text style={{color: Colors.black}}>
                Coupon id: {item.couponId}
              </Text>
              <Text style={{color: Colors.black}}>
                Coupon Name: {item.name}
              </Text>
              <Text style={{color: Colors.black}}>Code: {item.code}</Text>
              <Text style={{color: Colors.black}}>
                Assign Date: {item.assignDate}
              </Text>
              <Text style={{color: Colors.black}}>
                Expire Date: {item.expireDate}
              </Text>
            </View>
          );
        }}
        style={styles.couponList}
      />
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

  couponList: {
    marginTop: 10,
    marginHorizontal: 10,
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
