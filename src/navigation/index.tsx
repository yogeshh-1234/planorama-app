import React, {useEffect, useState} from 'react';
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import IntroScreen from '../screens/Onboarding/IntroScreen';
import {storage} from '../functions/storage';
import AuthScreen from '../screens/Onboarding/AuthScreen';
import HomeScreen from '../screens/Dashboard/HomeScreen';
import EventCreation from '../screens/EventCreation';
import EventConfirmDetails from '../screens/EventCreation/EventConfirmDetails';
import EventDetails from '../screens/EventDetails';
import Profile from '../screens/Profile';
import Contacts from '../screens/Contacts';
import ContactsScreen from '../screens/Contacts/ContactsScreen';
import NewContact from '../screens/Contacts/NewContact';
import EventSettingsScreen from '../screens/EventDetails/EventSettingsScreen';
import {EventDetailsType} from '../screens/EventDetails/EveDetType';
import EventGuest from '../screens/EventGuest';
import SendMsgScreen from '../screens/SendMsgScreen';
import PreviewScreen from '../screens/SendMsgScreen/PreviewScreen';
import SuccessScreen from '../screens/SendMsgScreen/SuccessScreen';
import {Linking, ToastAndroid, View} from 'react-native';
import {Portal} from 'react-native-paper';
import Loading from '../components/Loading';
import LoadingCompo from '../components/LoadingCompo';

export const MAINSCREENS: Record<string, keyof RootStackParamList> = {
  IntroScreen: 'IntroScreen',
  AuthScreen: 'AuthScreen',
  HomeScreen: 'HomeScreen',
  EventCreation: 'EventCreation',
  EventConfirmDetails: 'EventConfirmDetails',
  EventDetails: 'EventDetails',
  ProfileScreen: 'ProfileScreen',
  ContactsScreen: 'ContactsScreen',
  ImportContacts: 'ImportContacts',
  AddNewContact: 'AddNewContact',
  EventSettingsScreen: 'EventSettingsScreen',
  EventGuest: 'EventGuest',
  SendMsgScreen: 'SendMsgScreen',
  PreviewScreen: 'PreviewScreen',
  SuccessScreen: 'SuccessScreen',
};

export type RootStackParamList = {
  IntroScreen: undefined;
  AuthScreen: undefined;
  HomeScreen: undefined;
  EventCreation: {
    eventID?: number;
    eventData?: EventDetailsType;
    galleryData?: string[];
    onGoBack?: () => void;
  };
  EventConfirmDetails: confirmEvent;
  EventDetails: {id: number; invited?: boolean; onGoBack?: () => void};
  ProfileScreen: profileType;
  ContactsScreen: {
    eventID: number;
    fromGuest?: boolean;
    onGoBack?: () => void;
    eventName?: string;
    eventPic?: string;
  };
  ImportContacts: {onGoBack?: () => void};
  AddNewContact: {onGoBack?: () => void};
  EventSettingsScreen: {eventID?: number};
  EventGuest: {eventID: number; eventName: string; eventPic: string};
  SendMsgScreen: {
    guestList: guestListType[];
    eventID: number;
    eventName: string;
    eventPic: string;
  };
  PreviewScreen: {
    eventID: number;
    guestsIds: number[]; // in array
    message: string;
    messageHTML: string;
    fileBase: string;
    fileName: string;
    eventName: string;
    eventPic: string;
  };
  SuccessScreen: {
    type: string;
    count?: number;
    title: string;
    eventID: number;
    eventName: string;
  };
};

export type guestListType = {
  name: string;
  number: string;
  id: string;
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
  link: string;
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

function DeepLinkHandler() {
  const navigation = useNavigation<MainStackNavigation>();
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    const handleDeepLink = (event: {url: string}) => {
      setLoading(true);
      fetch(`${event.url}&a=Y`)
        .then(response => response.json())
        .then(data => {
          setLoading(false);
          if (data.event_id) {
            navigation.navigate('EventDetails', {
              id: data.event_id,
              invited: false,
            });
          } else {
            ToastAndroid.showWithGravity(
              `Event Not Found!`,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }
        })
        .catch(error => {
          setLoading(false);
          ToastAndroid.showWithGravity(
            `Error fetching event details:', ${error}`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        });
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  return loading ? <LoadingCompo text="Loading Event..." /> : null;
}

function MainNavigation(): React.JSX.Element {
  const [userToken, setUserToken] = React.useState('');

  React.useEffect(() => {
    const init = async () => {
      const token = storage.getString('user.token');
      if (token !== null && token !== undefined && token?.length > 1) {
        setUserToken(token);
      } else {
        setUserToken('');
      }
    };

    init();

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

  return (
    <NavigationContainer>
      <DeepLinkHandler />
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
            <Stack.Screen
              name={MAINSCREENS.ContactsScreen}
              component={Contacts}
            />
            <Stack.Screen
              name={MAINSCREENS.ImportContacts}
              component={ContactsScreen}
            />
            <Stack.Screen
              name={MAINSCREENS.AddNewContact}
              component={NewContact}
            />
            <Stack.Screen
              name={MAINSCREENS.EventSettingsScreen}
              component={EventSettingsScreen}
            />
            <Stack.Screen
              name={MAINSCREENS.EventGuest}
              component={EventGuest}
            />
            <Stack.Screen
              name={MAINSCREENS.SendMsgScreen}
              component={SendMsgScreen}
            />
            <Stack.Screen
              name={MAINSCREENS.PreviewScreen}
              component={PreviewScreen}
            />
            <Stack.Screen
              name={MAINSCREENS.SuccessScreen}
              component={SuccessScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigation;
