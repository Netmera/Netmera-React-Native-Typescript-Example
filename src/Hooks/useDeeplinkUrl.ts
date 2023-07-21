import {useEffect, useState} from 'react';
import {Linking} from 'react-native';

export const useDeeplinkUrl = () => {
  const [deeplinkUrl, setDeeplinkUrl] = useState<string | null>(null);

  const EVENT_NAME = 'url';

  useEffect(() => {
    // If the app is already open, the app is foregrounded and a Linking 'url' event is fired
    Linking.addEventListener(EVENT_NAME, ({url}) => {
      setDeeplinkUrl(url);
    });

    // If the app is not already open, it is opened and the url is passed in as the initialURL
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
