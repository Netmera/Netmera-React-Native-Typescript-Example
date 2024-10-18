/*
 * Copyright (c) 2022 Inomera Research.
 */

import {StyleSheet} from 'react-native';
import Colors from './Colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },

  scrollView: {
    marginTop: 10,
    width: '100%',
  },

  text: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },

  textInput: {
    color: Colors.black,
    borderColor: Colors.dark,
    borderWidth: 1,
    borderRadius: 10,
    width: '60%',
    height: '10%',
    marginBottom: 10,
    paddingLeft: 10,
  },

  bigTextInput: {
    color: Colors.black,
    borderColor: Colors.dark,
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    height: 40,
    marginVertical: 5,
    paddingLeft: 10,
  },

  buttonText: {
    fontSize: 13,
    color: 'white',
    alignSelf: 'center',
  },

  button: {
    alignItems: 'center',
    backgroundColor: Colors.buttonColor,
    borderRadius: 4,
    padding: 10,
    margin: 5,
    width: '80%',
  },

  picker: {
    width: '50%',
    backgroundColor: Colors.lighter,
    marginBottom: 5,
  },

  dropdown: {
    width: '100%',
    marginTop: 5,
  },

  column: {
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 15,
  },

  row: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
  },

  rowItem: {
    flex: 1,
    paddingHorizontal: 2,
  },

  inboxButton: {
    width: '100%',
  },

  divider: {
    marginVertical: 10,
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0 , .1)',
  },
});

export default styles;
