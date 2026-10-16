/*
 * Copyright (c) 2026 Netmera Research.
 */

import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Netmera, NetmeraCouponObject} from 'react-native-netmera';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import AppColors from '../ui/AppColors';

const Coupons = () => {
  const [page, setPage] = useState('0');
  const [max, setMax] = useState('10');
  const [coupons, setCoupons] = useState<NetmeraCouponObject[]>([]);
  const [result, setResult] = useState('No coupons fetched yet');
  const [loading, setLoading] = useState(false);

  const fetchCoupons = () => {
    if (!page || !max) {
      return;
    }
    setLoading(true);
    Netmera.fetchCoupons(Number(page), Number(max))
      .then(fetched => {
        setCoupons(fetched);
        setResult(fetched.length > 0 ? `Found ${fetched.length} coupons` : 'No coupons found');
      })
      .catch(error => {
        setCoupons([]);
        setResult(`Error: ${error.message}`);
      })
      .finally(() => setLoading(false));
  };

  const header = (
    <View style={styles.form}>
      <Text style={styles.title}>Coupon Filter Parameters</Text>
      <Text style={styles.label}>Page (index)</Text>
      <TextField
        testID="coupons.page.textField"
        placeholder="Page index"
        keyboardType="number-pad"
        value={page}
        onChangeText={setPage}
      />
      <Text style={styles.label}>Page size (max count)</Text>
      <TextField
        testID="coupons.max.textField"
        placeholder="Page size"
        keyboardType="number-pad"
        value={max}
        onChangeText={setMax}
      />
      <Button
        testID="coupons.fetch"
        title={loading ? 'Fetching...' : 'Fetch Coupons'}
        disabled={loading}
        onPress={fetchCoupons}
      />
      <Text testID="coupons.result" style={styles.result}>
        {result}
      </Text>
    </View>
  );

  return (
    <FlatList
      testID="coupons.list"
      data={coupons}
      keyExtractor={(item, index) => `${item.couponId}-${index}`}
      ListHeaderComponent={header}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
      renderItem={({item}) => (
        <View style={styles.coupon}>
          <Text style={styles.couponTitle}>
            {item.code} - {item.name}
          </Text>
          <Text style={styles.couponDetail}>
            ID: {item.couponId} | Expires: {item.expireDate} | Assigned: {item.assignDate}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.surface,
  },
  form: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: AppColors.label,
  },
  label: {
    marginTop: 8,
    fontSize: 15,
    color: AppColors.label,
  },
  result: {
    marginTop: 8,
    fontSize: 15,
    color: AppColors.mutedText,
  },
  coupon: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.divider,
  },
  couponTitle: {
    fontSize: 16,
    color: AppColors.label,
  },
  couponDetail: {
    marginTop: 2,
    fontSize: 13,
    color: AppColors.mutedText,
  },
});

export default Coupons;
