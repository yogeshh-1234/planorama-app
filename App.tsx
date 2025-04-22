import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {configureFonts, MD3LightTheme, PaperProvider} from 'react-native-paper';
import fontConfig from './src/config/fonts';
import MainNavigation from './src/navigation';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {LogBox} from 'react-native';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import 'react-native-get-random-values';
// import colors from './src/config/colors';
const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({
    config: fontConfig,
  }),
  // colors,
};
// export type AppTheme = typeof theme;

// export const useAppTheme = () => useTheme<AppTheme>();

// Create a client
const queryClient = new QueryClient();
async function requestUserPermission() {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    // console.log('Permission settings:', settings);
  } else {
    // console.log('User declined permissions');
  }
}
function App(): React.JSX.Element {
  useEffect(() => {
    // LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs(); //Ignore all log notifications

    requestUserPermission();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MainNavigation />
      </QueryClientProvider>
    </PaperProvider>
  );
}

export default App;
