import {useEffect, useState} from 'react';
import {Linking} from 'react-native';

export const useDeeplinkUrl = () => {
  const [deeplinkUrl, setDeeplinkUrl] = useState<string | null>(null);

  const EVENT_NAME = 'url';

  useEffect(() => {
    // If the app is already open, it will pass to the foreground state and Linking 'url' event will be triggered.
    Linking.addEventListener(EVENT_NAME, ({url}) => {
      setDeeplinkUrl(url);
    });

    // If the app is not already open, it will be launched and the URL will be passed as 'initialUrl'.
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      setDeeplinkUrl(initialUrl);
    };
    getUrlAsync();

    return () => {
      // Remove event listener
      Linking.removeAllListeners(EVENT_NAME);
    };
  }, []);
  return {deeplinkUrl};
};
