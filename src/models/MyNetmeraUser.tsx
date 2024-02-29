/*
 * Copyright (c) 2022 Inomera Research.
 */

// @ts-ignore
import {NetmeraUser} from 'react-native-netmera';

export default class MyNetmeraUser extends NetmeraUser {
  // Custom Enum Attributes
  static TestGender = {
    TESTGENDER_MALE: 1,
    TESTGENDER_FEMALE: 2,
    TESTGENDER_NOT_SPECIFIED: 3,
  };

  private ya: string | undefined;
  private sl: number | undefined;

  // Custom Attributes
  set testName(value: string) {
    this.ya = value;
  }

  set testGender(value: number) {
    this.sl = value;
  }
}
