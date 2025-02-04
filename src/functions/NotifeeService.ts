import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidCategory,
  EventType,
  AndroidStyle,
  EventDetail,
} from '@notifee/react-native';
import {navigate} from './NavigationService';
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
      },
      autoCancel: true,

      // actions: [
      //   {
      //     title: 'View Details',
      //     pressAction: {id: 'ViewRequest'},
      //   },
      // ],
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
    // if(detail.notification?.data?.type==="new_inv_event"){
    NavigateOnPress(type, detail);
    // }
  });

  // Handle notification click when app is in background or terminated
  notifee.onBackgroundEvent(async ({type, detail}) => {
    // if(detail.notification?.data?.type==="new_inv_event"){
    NavigateOnPress(type, detail);
    // }
  });

  const NavigateOnPress = (type: EventType, detail: EventDetail) => {
    const chatDetails = {
      id: parseInt(`${detail.notification?.data?.event_id}`),
      invited:
        detail.notification?.data?.type === 'new_inv_event' ? true : false,
    };

    switch (type) {
      case EventType.PRESS:
        navigate('EventDetails', chatDetails);
        break;
    }
  };
}

// not used
export async function initializeNotifee() {
  await createNotificationChannel();
  setupMessageListener();
  setupNotifeeEvents();
}
