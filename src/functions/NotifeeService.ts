import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidCategory,
  EventType,
  AndroidStyle,
  EventDetail,
} from '@notifee/react-native';
import {navigate, navigateReset} from './NavigationService';
import {storage} from './storage';

async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'general',
    name: 'General',
    importance: AndroidImportance.HIGH,
  });
}

export async function displayNotification(remoteMessage: any) {
  // console.log('displayNotification', remoteMessage);

  generalNotifications(remoteMessage);
}

const generalNotifications = async (remoteMessage: any) => {
  const {cust_id, event_id, title, event_guest_id, type, body} =
    remoteMessage.data;

  await notifee.displayNotification({
    id: `${event_guest_id}${cust_id}`,
    title: `${title}`,
    body: `${body}`,
    data: {
      event_guest_id: `${event_guest_id}`,
      event_id: `${event_id}`,
      cust_id: `${cust_id}`,
    },
    android: {
      channelId: 'general',
      smallIcon: 'ic_stat_planorama', // Use your app icon
      color: '#75486F', // Background color
      // largeIcon: profilePic, // Display sender's avatar if available
      category: AndroidCategory.SERVICE,
      importance: AndroidImportance.DEFAULT,
      showTimestamp: true,
      pressAction: {
        id: 'default',
        launchActivity: 'default'
      },
      autoCancel: true,
    },
  });
  //
  //
  //
};

export function setupMessageListener() {
  // Foreground messages
  messaging().onMessage(async remoteMessage => {
    // console.log('onMessage', remoteMessage);
    const userToken = storage.getString('user.token');
    if (userToken !== null && userToken !== undefined) {
      await displayNotification(remoteMessage);
    }
  });

  // Background and quit-state messages
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // console.log('setBackgroundMessageHandler', remoteMessage);
    const userToken = storage.getString('user.token');
    if (userToken !== null && userToken !== undefined) {
      await displayNotification(remoteMessage);
    }
  });
}

export function setupNotifeeEvents() {
  notifee.onForegroundEvent(({type, detail}) => {
    NavigateOnPress(type, detail);
  });

  // Handle notification click when app is in background or terminated
  notifee.onBackgroundEvent(async ({type, detail}) => {
    NavigateOnPress(type, detail);
  });

  const NavigateOnPress = (type: EventType, detail: EventDetail) => {
    // console.log('type, detail', type, detail);
    // console.log('EventType', EventType.PRESS, type, EventType.ACTION_PRESS);
    // got noti
    // EventType 1 3 2

    // presses noti
    // EventType 1 1 2

    if (EventType.PRESS === type || EventType.ACTION_PRESS === type) {
      // on notification view message press

      // console.log('press event');

      if (`${detail.notification?.data?.event_id}`?.length > 0) {
        const chatDetails = {
          id: parseInt(`${detail.notification?.data?.event_id}`),
          invited:
            detail.notification?.data?.type === 'new_inv_event' ? true : false,
        };
        // console.log('EventDetails', chatDetails);
        navigateReset(
          [
            {name: 'HomeScreen'},
            {
              name: 'EventDetails',
              params: chatDetails,
            },
          ],
          1,
        );
      }
    }
  };
}

// not used
export async function initializeNotifee() {
  await createNotificationChannel();
  setupMessageListener();
  setupNotifeeEvents();
}
