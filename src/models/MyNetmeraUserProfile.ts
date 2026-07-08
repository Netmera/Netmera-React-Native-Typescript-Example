import {
  NetmeraUserProfile,
  NetmeraProfileAttribute,
  NetmeraProfileAttributeCollection,
} from 'react-native-netmera';

export class MyNetmeraUserProfile extends NetmeraUserProfile {
  public luckyNumbers = new NetmeraProfileAttributeCollection<number>();
  public isLuckyNumbersEnabled = new NetmeraProfileAttribute<boolean>();
  public lastLoginPlatform = new NetmeraProfileAttribute<string>();
  public loginCount = new NetmeraProfileAttribute<number>();

  protected getSerializationMap(): Record<string, string> {
    const baseMap = super.getSerializationMap();

    const customMap = {
      luckyNumbers: 'is',
      isLuckyNumbersEnabled: 'qr',
      lastLoginPlatform: 'ya',
      loginCount: 'oc',
    };

    return { ...baseMap, ...customMap };
  }
}
