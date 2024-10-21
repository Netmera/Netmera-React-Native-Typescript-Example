declare module 'react-native-config' {
  export interface NativeConfig {
    NETMERA_PREPROD_API_KEY?: string;
    NETMERA_PROD_API_KEY?: string;
    NETMERA_TEST_API_KEY?: string;
    NETMERA_UAT_API_KEY?: string;
    NETMERA_PREPROD_BASE_URL?: string;
    NETMERA_PROD_BASE_URL?: string;
    NETMERA_TEST_BASE_URL?: string;
    NETMERA_UAT_BASE_URL?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
