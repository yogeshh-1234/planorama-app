import React from 'react';
import {NavigationContainer, NavigationProp} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import IntroScreen from '../screens/Onboarding/IntroScreen';
import {storage} from '../functions/storage';
import AuthScreen from '../screens/Onboarding/AuthScreen';
import HomeScreen from '../screens/Dashboard/HomeScreen';

export const MAINSCREENS: Record<string, keyof RootStackParamList> = {
  IntroScreen: 'IntroScreen',
  AuthScreen: 'AuthScreen',
  HomeScreen: 'HomeScreen',
};

export type RootStackParamList = {
  IntroScreen: undefined;
  AuthScreen: undefined;
  HomeScreen: undefined;
};

export type MainStackNavigation = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainNavigation(): React.JSX.Element {
  const [userToken, setUserToken] = React.useState('');
  //
  React.useEffect(() => {
    // storage.clearAll();
    const init = async () => {
      const token = storage.getString('user.token');
      if (token !== null && token !== undefined && token?.length > 1) {
        setUserToken(token);
      } else {
        setUserToken('');
      }
    };

    init();

    //  listener
    const listener = storage.addOnValueChangedListener(changedKey => {
      const newValue = storage.getString(changedKey);
      if (changedKey === 'user.token') {
        if (
          newValue !== null &&
          newValue !== undefined &&
          newValue?.length > 1
        ) {
          setUserToken(newValue);
        } else {
          setUserToken('');
        }
      }
    });
    return () => {
      listener.remove();
    };
  }, [userToken]);
  //

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}>
        {!(userToken.length > 1) ? (
          <>
            <Stack.Screen
              name={MAINSCREENS.IntroScreen}
              component={IntroScreen}
            />
            <Stack.Screen
              name={MAINSCREENS.AuthScreen}
              component={AuthScreen}
            />
          </>
        ) : (
          <Stack.Screen name={MAINSCREENS.HomeScreen} component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigation;
