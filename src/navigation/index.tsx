import React from 'react';
import {NavigationContainer, NavigationProp} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import IntroScreen from '../screens/Onboarding/IntroScreen';
import {storage} from '../functions/storage';
import AuthScreen from '../screens/Onboarding/AuthScreen';
import HomeScreen from '../screens/Dashboard/HomeScreen';
import EventCreation from '../screens/EventCreation';
import EventConfirmDetails from '../screens/EventCreation/EventConfirmDetails';
import EventDetails from '../screens/EventDetails';
import Profile from '../screens/Profile';

export const MAINSCREENS: Record<string, keyof RootStackParamList> = {
  IntroScreen: 'IntroScreen',
  AuthScreen: 'AuthScreen',
  HomeScreen: 'HomeScreen',
  EventCreation: 'EventCreation',
  EventConfirmDetails: 'EventConfirmDetails',
  EventDetails: 'EventDetails',
  ProfileScreen: 'ProfileScreen',
};

export type RootStackParamList = {
  IntroScreen: undefined;
  AuthScreen: undefined;
  HomeScreen: undefined;
  EventCreation: undefined;
  EventConfirmDetails: confirmEvent;
  EventDetails: {id: number};
  ProfileScreen: profileType;
};
type confirmEvent = {
  title: string;
  fontId: string;
  cover_img: string;
  bg_img: string;
  colorHex: string;
  date: string;
  time: string;
  location: string;
  description: string;
  rsvp: 'Y' | 'N' | 'M' | null;
  gallery: string[];
  id: number;
};

type profileType = {
  country_code: string;
  id: string;
  name: string;
  number: string;
  pic: string;
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
          <>
            <Stack.Screen
              name={MAINSCREENS.HomeScreen}
              component={HomeScreen}
            />
            <Stack.Screen
              name={MAINSCREENS.EventCreation}
              component={EventCreation}
            />
            <Stack.Screen
              name={MAINSCREENS.EventConfirmDetails}
              component={EventConfirmDetails}
            />
            <Stack.Screen
              name={MAINSCREENS.EventDetails}
              component={EventDetails}
            />
            <Stack.Screen
              name={MAINSCREENS.ProfileScreen}
              component={Profile}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigation;
