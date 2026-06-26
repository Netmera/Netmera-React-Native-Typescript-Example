/*
 * Copyright (c) 2026 Netmera Research.
 * AutoTracking test screen — covers tracked component types (no FlatList).
 */

import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker';
import {useForm, Controller} from 'react-hook-form';
import Colors from '../Colors';
import {Netmera} from 'react-native-netmera';
import { isAndroid } from '../helpers/DeviceUtils';

const CATEGORIES = ['All', 'Electronics', 'Sports', 'Home', 'Books'];

const log = (label: string) =>
  console.log(`[AutoTrackTest] action: "${label}"`);

const SectionTitle = ({title}: {title: string}) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const Divider = () => <View style={styles.divider} />;

const AutoTrackTest = () => {
  const [switchDark, setSwitchDark] = useState(false);
  const [switchNotif, setSwitchNotif] = useState(true);
  const [pickerValue, setPickerValue] = useState('all');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const {control, handleSubmit} = useForm({
    defaultValues: {email: '', message: ''},
  });

  return (
    <View style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* ── 1. Nested Buttons ──────────────────────────────────────────────── */}
        <SectionTitle title="1 · Nested Buttons" />
        <Text style={styles.hint}>
          Outer TouchableOpacity → "outer-view" should be logged.{'\n'}
          Tapping inner Pressables should log their own labels.
        </Text>

        <TouchableOpacity
          accessibilityLabel="outer-view"
          onPress={() => log('outer-view')}
          style={styles.nestedContainer}>
          <View style={styles.nestedRow}>
            <Pressable
              accessibilityLabel="btn-no"
              onPress={() => log('btn-no')}
              style={styles.nestedBtnRed}>
              <View style={styles.nestedBox}>
                <Text style={styles.nestedBoxText}>No</Text>
              </View>
            </Pressable>
            <Pressable
              accessibilityLabel="btn-yes"
              onPress={() => log('btn-yes')}
              style={styles.nestedBtnGreen}>
              <View style={styles.nestedBox}>
                <Text style={styles.nestedBoxText}>Yes</Text>
              </View>
            </Pressable>
          </View>
        </TouchableOpacity>

        <Divider />

        {/* ── 2. Standard Buttons ────────────────────────────────────────────── */}
        <SectionTitle title="2 · Standard Buttons" />

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          accessibilityLabel="primary-action"
          onPress={() => log('primary-action')}>
          <Text style={styles.btnTextWhite}>Primary — accessibilityLabel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => log('secondary-action')}>
          <Text style={styles.btnTextDark}>Secondary — text only (no label)</Text>
        </TouchableOpacity>

        <Pressable
          style={[styles.btn, styles.btnOutline]}
          accessibilityLabel="outline-btn"
          onPress={() => log('outline-btn')}>
          <Text style={styles.btnTextDark}>Pressable — outline + label</Text>
        </Pressable>

        <Divider />

        {/* ── 3. Text Inputs ─────────────────────────────────────────────────── */}
        <SectionTitle title="3 · Text Inputs" />
        <Text style={styles.hint}>
          If accessibilityLabel is set it is logged, otherwise placeholder.
        </Text>

        <TextInput
          style={styles.input}
          onFocus={() => isAndroid() && Netmera.trackAction('search-field')}
          placeholder="Search products…"
          accessibilityLabel="search-field"
        />

        <TextInput
          style={styles.input}
          onFocus={() => isAndroid() && Netmera.trackAction('email-field')}
          placeholder="Enter email"
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, styles.inputMultiline]}
          onFocus={() => isAndroid() && Netmera.trackAction('notes-field')}
          placeholder="Write your note…"
          multiline
          numberOfLines={3}
          accessibilityLabel="notes-field"
        />

        <Divider />

        {/* ── 4. Switch ──────────────────────────────────────────────────────── */}
        <SectionTitle title="4 · Switch" />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Dark Mode</Text>
          <Switch
            value={switchDark}
            onValueChange={v => {
              setSwitchDark(v);
              log('dark-mode-switch');
            }}
            accessibilityLabel="dark-mode-toggle"
          />
        </View>

        <View style={styles.row} accessibilityLabel="notifications-setting">
          <Text style={styles.rowLabel}>Notifications</Text>
          <Switch
            value={switchNotif}
            onValueChange={v => {
              setSwitchNotif(v);
              log('notifications-switch');
            }}
          />
        </View>

        <Divider />

        {/* ── 5. react-native-select-dropdown ────────────────────────────────── */}
        <SectionTitle title="5 · react-native-select-dropdown" />

        <SelectDropdown
          data={CATEGORIES}
          defaultValueByIndex={0}
          onSelect={(item: string) => log(`select-dropdown: ${item}`)}
          buttonTextAfterSelection={(item: string) => item}
          rowTextForSelection={(item: string) => item}
          buttonStyle={styles.dropdownBtn}
          buttonTextStyle={styles.dropdownBtnText}
        />

        <Divider />

        {/* ── 6. @react-native-picker/picker ─────────────────────────────────── */}
        <SectionTitle title="6 · @react-native-picker/picker" />

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={pickerValue}
            onValueChange={val => {
              setPickerValue(val as string);
              Netmera.trackAction(`category-picker|${val}`); // Example of sending an autotracking event manually
            }}
            accessibilityLabel="category-picker">
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Electronics" value="electronics" />
            <Picker.Item label="Sports" value="sports" />
            <Picker.Item label="Home & Living" value="home" />
            <Picker.Item label="Books" value="books" />
          </Picker>
        </View>

        <Divider />

        {/* ── 7. react-native-date-picker ────────────────────────────────────── */}
        <SectionTitle title="7 · react-native-date-picker" />

        <Pressable
          style={[styles.btn, styles.btnSecondary]}
          accessibilityLabel="pick-date-btn"
          onPress={() => {
            log('pick-date-btn');
            setDatePickerOpen(true);
          }}>
          <Text style={styles.btnTextDark}>
            Pick Date: {date.toLocaleDateString('en-US')}
          </Text>
        </Pressable>

        <DatePicker
          modal
          open={datePickerOpen}
          date={date}
          mode="date"
          onConfirm={d => {
            setDatePickerOpen(false);
            setDate(d);
            log(`date-picker confirmed: ${d.toLocaleDateString('en-US')}`);
          }}
          onCancel={() => setDatePickerOpen(false)}
        />

        <Divider />

        {/* ── 8. react-hook-form ─────────────────────────────────────────────── */}
        <SectionTitle title="8 · react-hook-form + Controller" />
        <Text style={styles.hint}>
          TextInputs wrapped with Controller — accessibilityLabel should be logged.
        </Text>

        <Controller
          control={control}
          name="email"
          render={({field: {onChange, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Email (form)"
              keyboardType="email-address"
              accessibilityLabel="form-email-field"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="message"
          render={({field: {onChange, value}}) => (
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Your message (form)"
              multiline
              numberOfLines={3}
              accessibilityLabel="form-message-field"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          accessibilityLabel="form-submit-btn"
          onPress={handleSubmit(data => log(`form submit: ${JSON.stringify(data)}`))}>
          <Text style={styles.btnTextWhite}>Submit Form</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default AutoTrackTest;

const styles = StyleSheet.create({
  safe:    {flex: 1, backgroundColor: Colors.lighter},
  scroll:  {flex: 1},
  content: {padding: 16, paddingBottom: 40},

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  divider: {height: 1, backgroundColor: Colors.light, marginVertical: 18},
  hint:    {fontSize: 12, color: Colors.dark, marginBottom: 10, lineHeight: 18},

  btn: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  btnPrimary:   {backgroundColor: Colors.primary},
  btnSecondary: {backgroundColor: Colors.light},
  btnOutline:   {borderWidth: 1.5, borderColor: Colors.primary, backgroundColor: Colors.white},
  btnGhost:     {backgroundColor: '#f0f0f0'},
  btnTextWhite: {color: Colors.white, fontWeight: '600'},
  btnTextDark:  {color: Colors.darker, fontWeight: '600'},

  input: {
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.white,
    marginBottom: 10,
    fontSize: 14,
    color: Colors.darker,
  },
  inputMultiline: {height: 80, textAlignVertical: 'top'},

  row:      {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14},
  rowLabel: {fontSize: 15, color: Colors.darker},

  dropdownBtn: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    marginBottom: 4,
  },
  dropdownBtnText: {fontSize: 14, color: Colors.darker, textAlign: 'left'},

  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginBottom: 4,
    overflow: 'hidden',
  },

  nestedContainer: {
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    minHeight: 140,
  },
  nestedRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  nestedBtnRed: {
    flex: 1,
    backgroundColor: '#E05252',
    borderRadius: 8,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nestedBtnGreen: {
    flex: 1,
    backgroundColor: '#5CB85C',
    borderRadius: 8,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nestedBox: {
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nestedBoxText: {fontSize: 24, fontWeight: '700', color: '#000'},
});
