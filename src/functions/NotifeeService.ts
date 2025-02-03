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
      color: '#75486F', //  color
      // largeIcon: profilePic, // Display sender's avatar if available
      category: AndroidCategory.SERVICE,
      importance: AndroidImportance.DEFAULT,
      showTimestamp: true,
      // pressAction: {id: ``},
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
  // // both can be true
  // if (remoteMessage?.data?.InApp === 'true') {
  //   // console.log('InApp');
  //   const inAppNoti = {
  //     title: `${title}`,
  //     body: `${body}`,
  //     requestType: `${requestype}`,
  //     requestID: `${requestID}`,
  //     notiType: `${type}`,
  //   };
  //   const jsonString = JSON.stringify(inAppNoti);
  //   storage.set('inAppNoti', jsonString);
  // }
  // if (remoteMessage?.data?.push === 'true') {
  //   // console.log('push');
  //   await notifee.displayNotification({
  //     id: `ViewRequest`,
  //     title: `${title}`,
  //     body: `${body}`,
  //     data: {
  //       requestID: `${requestID}`,
  //       requestype: `${requestype}`,
  //       type: `${type}`,
  //     },
  //     android: {
  //       channelId: 'request-service',
  //       smallIcon: 'ic_stat_rm', // Use your app icon
  //       color: '#212121', //  color
  //       // largeIcon: profilePic, // Display sender's avatar if available
  //       category: AndroidCategory.SERVICE,
  //       importance: AndroidImportance.DEFAULT,
  //       showTimestamp: true,
  //       pressAction: {id: `${remoteMessage?.data?.requestype}`},
  //       actions: [
  //         {
  //           title: 'View Details',
  //           pressAction: {id: 'ViewRequest'},
  //         },
  //       ],
  //     },
  //   });
  // }
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

    navigate('EventDetails', chatDetails);

    // const senderID = `${detail.notification?.data?.senderID}`;
    // const senderName = `${detail.notification?.data?.senderName}`;
    // const profilePic = `${detail.notification?.data?.profilePic}`;

    // const NewProfilePic =
    //   profilePic?.length > 0
    //     ? profilePic
    //     : `https://avatar.iran.liara.run/username?username=${senderName.replaceAll(
    //         ' ',
    //         '+',
    //       )}`;

    // const requestID = `${detail.notification?.data?.requestID}`;
    // const requestype = `${detail.notification?.data?.requestype}`;

    // if (type === EventType.ACTION_PRESS) {
    //   const chatDetails = {
    //     id: senderID,
    //     name: senderName,
    //     pic: NewProfilePic,
    //   };
    //   const requestData = {
    //     id: requestID,
    //     type: requestype,
    //   };

    //   if (detail.pressAction?.id === 'chatView') {
    //     // navigate to message Screen
    //     navigate('MessageScreen', chatDetails);
    //     //
    //   } else if (detail.pressAction?.id === 'ViewRequest') {
    //     if (detail.notification?.data?.type === 'requestDetails') {
    //       // navigate to view request
    //       navigate('RequestDetails', requestData);
    //     }
    //   }
    // }
  };
}

// not used
export async function initializeNotifee() {
  await createNotificationChannel();
  setupMessageListener();
  setupNotifeeEvents();
}
