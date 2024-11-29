import 'react-native-gesture-handler';
import React from 'react';
import {configureFonts, MD3LightTheme, PaperProvider} from 'react-native-paper';
import fontConfig from './src/config/fonts';
import MainNavigation from './src/navigation';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
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

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MainNavigation />
      </QueryClientProvider>
    </PaperProvider>
  );
}

export default App;
