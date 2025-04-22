import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import {BGline} from '../../assets/SVG/VectorSVG';
import Header from './components/Header';
import Text from '../../components/Text';
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import {
  CalenderSVG,
  ClockSVG,
  NewEventBox,
  QuesSVG,
  SearchSVG,
  ThumbsUpSVG,
} from '../../assets/SVG/IconsSVG';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {
  dashError,
  dashEventsResponse,
  dashFormType,
  eventItem,
  profileResponse,
} from './dashTypes';
import {postData} from '../../api';
import Urls from '../../api/urls';
import PopupCompo from '../../components/PopupCompo';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeOutLeft,
} from 'react-native-reanimated';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../navigation';
import LoadingCompo from '../../components/LoadingCompo';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidCategory,
} from '@notifee/react-native';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const {width, height} = Dimensions.get('screen');
const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

const paddingHorizontal = width * 0.05;

interface EventType {
  pic: string;
  title: string;
  date: string;
  time: string;
  goingStatus: string;
  eventStatus: string;
  goingList: goingListType[];
  goingListTotal: number;
}
interface goingListType {
  name: string;
  pic: string;
}
// const eventList = [
//   {
//     pic: 'https://s3-alpha-sig.figma.com/img/c9fb/05c9/f9f87fa6736978b3dc687a0538f64b6a?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KRZ4s5JN1MxAhrzlCQ99jbMyBM5EXDzA0EUInMFLyYWfuPTawTlp-KTM2f2X5pin7YvUdKNhO44M3kd-Pm~oE0BAs8OVrrO0K2p7vitVA~EhprcF9cXRzlQIVWDS4HSmydev5MThECtnG18p3Do5dcwi84MZ9OKLx8mpCDTcasVLbTaoa8Dj~TCTJM~hu4Heoipw0G2TKm5cOblD8ZYheRAQaABCxURwRl6SKJMIBvGWwbNznmYuXqdnflngKT71y2vTbMP9J6kPcIv38pPiJuHULsUsx3GKrSIhhu99uzkw6TAUXKDXI6jlH8eSoTvBjSylslpO~THRRbVaImBEiA__',
//     title: 'New Year Celebration',
//     date: '31/12/2024',
//     time: '20:00',
//     goingStatus: 'Y', // Y / N - Yes / No
//     eventStatus: 'CLOSED EVENT (N/R. mobile)', // CLOSED EVENT (N/R. mobile)
//     goingList: [
//       {
//         name: 'Chinmay Palekar',
//         pic: '',
//       },
//     ],
//     goingListTotal: 1,
//   },
//   {
//     pic: 'https://s3-alpha-sig.figma.com/img/fb7c/a046/cc247627452c7be672f73b7a15272921?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YFwirekgUHmBh1mgMGJCbZYuLWV85QASVI76LpqzO5Qp3VBEJsAvu8ErF14vFmYfUZdLLoaILlwo~utk293H~P5VyUZdzC47hqanXb0lXU1XMbPNg7Tj-eZM0JEuXPXuL9GVFPJTRPbVBemEa~7qmvht626xzAeidm19jzzh61WAEZpiWtl8t5vFiXrm5FjJ4zMAJkvx-k~8b0KzKgIcXfeC21C1-mYG-hjHPC~A1ZPCNbcPVOvY18wI9I0lW4FVusnxJD3MzWlgNhoPEi2ucRVUBOG56BNH0v~tUo~RuTNEfSYVE52HEbq9y0FCQbP20Qpzb8-im6JUR6x~jtqbvA__',
//     title: 'XMAS EVE',
//     date: '25/12/2024',
//     time: '10:30',
//     goingStatus: 'N', // Y / N - Yes / No
//     eventStatus: 'CLOSED EVENT (Resp. mobile)', // CLOSED EVENT (N/R. mobile)
//     goingList: [
//       {
//         name: 'Chinmay Palekar',
//         pic: '',
//       },
//       {
//         name: 'Chinmay Palekar',
//         pic: '',
//       },
//       {
//         name: 'Chinmay Palekar',
//         pic: '',
//       },
//     ],
//     goingListTotal: 5,
//   },
//   {
//     pic: 'https://s3-alpha-sig.figma.com/img/207e/5493/a9880199d716a0f5c2dcb1449166f613?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Mx1BN0Eta2e7wqZyQl9K~sKdrfLrSjESwZABFoelX4KVhy1muTHn968VOnPBjmOaVgpO1XdTMLnxq66LkcV3ozc9y6Y4OyCXFul6OjPCsHNLBt2I0WR48jERckXGeV1-djaqapPaNRDh9mHRuEK5yoKIzMDXiH1j4VRMr6sJaylSHAKDEgfk9mrdfe1oUcV02X1gDOySUpJYwuPPiJM7f9fE~iz9mOOH50m7bhsm-eBoiK5oLv2~OegGW22KzHbKQld04UTRu43g15Ot27509~zXeb3JX3y2BVlIqsn18b0UWx627xH5KzQhVWmJsj2em4t9mAtKDmtA0M91YuYV~Q__',
//     title: 'Birthday Party',
//     date: '31/12/2024',
//     time: '20:00',
//     goingStatus: '', // Y / N - Yes / No
//     eventStatus: 'CLOSED EVENT (web)', // CLOSED EVENT (N/R. mobile)
//     goingList: [
//       {
//         name: 'Chinmay Palekar',
//         pic: '',
//       },
//     ],
//     goingListTotal: 1,
//   },
// ];
type EventListType = 'your' | 'invited';
type EventTypeText = 'Upcoming' | 'Previous';
interface formDataFCM {
  mode: string;
  token: string;
  id: string;
  device_token: string;
}
interface SuccessResponseType {
  message: string;
  statusCode: number;
}
export default function () {
  const navigation = useNavigation<MainStackNavigation>();
  const [profileData, setProfileData] = useState({
    country_code: '',
    id: '',
    name: '',
    number: '',
    pic: '',
  });
  const [loading, setLoading] = useState(false);
  const [popupModal, setPopupModal] = useState(PopupModal);
  const [justToReload, setJustToReload] = useState(false);

  useEffect(() => {
    const tempName = storage.getString('user.name');
    const tempPic = storage.getString('user.pic');
    if (
      tempName !== null &&
      tempName !== undefined &&
      tempPic !== null &&
      tempPic !== undefined
    ) {
      setProfileData(pre => ({
        ...pre,
        pic: tempPic,
        name: tempName,
      }));
    }
    callAPI();
  }, [justToReload]);

  const callAPI = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        mode: 'VIEW_PROFILE',
        token,
        id,
      };
      setLoading(true);
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<profileResponse, dashError, dashFormType>({
    mutationFn: (formData: dashFormType) =>
      postData<dashFormType, profileResponse>(Urls.PROFILE, formData),
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        setProfileData({
          pic: data.pic,
          name: data.name,
          country_code: data.country_code,
          id: data.id,
          number: data.number,
        });
        data?.name && storage.set('user.name', data.name);
        data?.pic && storage.set('user.pic', data.pic);

        //
      } else {
        setPopupModal({
          state: true,
          title: `Oops! Something went wrong.${
            StatusCode ? ` [${StatusCode}]` : ''
          }`,
          disc: "Couldn't load profile data, please try again!",
          buttOne: 'LOGOUT',
          buttTwo: 'RETRY',
        });
      }
      setLoading(false);
    },
    onError: error => {
      setLoading(false);

      setPopupModal({
        state: true,
        title: `Oops! Something went wrong.${
          error?.StatusCode ? ` [${error.StatusCode}]` : ''
        }`,
        disc: error?.error?.description
          ? error.error.description
          : "We couldn't complete your request, please try again!",
        buttOne: 'LOGOUT',
        buttTwo: 'RETRY',
      });
    },
  });

  const onDismiss = useCallback(() => {
    setPopupModal({...popupModal, state: false});
  }, [popupModal.state]);

  const buttOnePress = useCallback(() => {
    if (popupModal.buttOne === 'LOGOUT') {
      setPopupModal({...popupModal, state: false});
      storage.clearAll();
    }
  }, [popupModal.state]);

  const buttTwoPress = useCallback(() => {
    if (popupModal.buttTwo === 'RETRY') {
      setPopupModal({...popupModal, state: false});
      callAPI();
    }
  }, [popupModal.state]);

  const AddEvent = () => {
    storage.delete('SettingsData');
    navigation.navigate('EventCreation', {});
  };

  //
  //
  //
  const gettokenFn = async () => {
    const fcmToken = await messaging().getToken();

    // call api
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      mutationFCM.mutate({
        mode: 'UPDATE_DEVICE_TOKEN',
        token,
        id,
        device_token: fcmToken,
      });
    }
  };

  // API call
  const mutationFCM = useMutation({
    mutationFn: (formData: formDataFCM) =>
      postData<formDataFCM, SuccessResponseType>(Urls.PROFILE, formData),
    onSuccess: data => {
      // console.log(data);
    },
    onError: error => {
      // console.log(error);
    },
  });

  useEffect(() => {
    gettokenFn();
  }, []);

  return (
    <Animated.View
      style={{
        backgroundColor: '#75486F',
        flex: 1,
        paddingTop: StatusBar.currentHeight,
      }}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent
        barStyle={'light-content'}
      />
      <BGline
        width={'100%'}
        height={height * 0.1}
        style={{
          position: 'absolute',
          top: Top_Height + height * 0.02,
          left: 0,
          right: 0,
        }}
      />
      <Header
        country_code={profileData.country_code}
        id={profileData.id}
        name={profileData.name}
        number={profileData.number}
        pic={profileData.pic}
      />
      <ScrollView
        contentContainerStyle={{
          paddingTop: height * 0.01,
          paddingBottom: height * 0.04,
          gap: 12,
        }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => setJustToReload(pre => !pre)}
            title="Pull to refresh"
            colors={['#F2F2F2']}
            progressBackgroundColor={'#0E0E0E'}
            titleColor="grey"
          />
        }>
        <WelcomeCompo name={profileData.name} />
        <SearchCompo />
        {!loading && (
          <>
            <EventsCompo lable={'your'} justToReload={justToReload} />
            <EventsCompo lable={'invited'} justToReload={justToReload} />
          </>
        )}
      </ScrollView>
      {loading && <LoadingCompo text="Getting events data" />}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}>
        <Button
          lable="+ New Event"
          onPress={AddEvent}
          buttonStyles={{
            width: 'auto',
            paddingHorizontal: 20,
          }}
        />
      </View>
      <PopupCompo
        isVisible={popupModal.state}
        onDismiss={onDismiss}
        title={popupModal.title}
        disc={popupModal.disc}
        buttOne={popupModal.buttOne}
        buttTwo={popupModal.buttTwo}
        buttOnePress={buttOnePress}
        buttTwoPress={buttTwoPress}
      />
    </Animated.View>
  );
}

const EventsCompo = memo(
  ({lable, justToReload}: {lable: EventListType; justToReload: boolean}) => {
    const [type, setType] = useState<EventTypeText>('Upcoming');
    const [loading, setLoading] = useState(false);
    const [popupModal, setPopupModal] = useState(PopupModal);
    const [preEventsList, setPreEventsList] = useState<eventItem[]>([]);
    const [upEventsList, setUpEventsList] = useState<eventItem[]>([]);
    const [totalCount, setTotalCount] = useState({
      up: '',
      pre: '',
    });

    useEffect(() => {
      if (
        (type === 'Previous' && preEventsList.length === 0) ||
        (type === 'Upcoming' && upEventsList.length === 0)
      ) {
        callAPI();
      }
    }, [type, lable, justToReload]);

    const callAPI = () => {
      const token = storage.getString('user.token');
      const id = storage.getString('user.id');
      if (
        token !== null &&
        token !== undefined &&
        id !== null &&
        id !== undefined
      ) {
        const mode =
          lable === 'your'
            ? type === 'Upcoming'
              ? 'MY_EVT_LIST_UP'
              : 'MY_EVT_LIST_PREV'
            : type === 'Upcoming'
            ? 'INV_EVT_LIST_UP'
            : 'INV_EVT_LIST_PREV';
        const formData = {
          mode,
          token,
          id,
        };
        setLoading(true);

        mutation.mutate(formData);
      }
    };
    const mutation = useMutation<dashEventsResponse, dashError, dashFormType>({
      mutationFn: (formData: dashFormType) =>
        postData<dashFormType, dashEventsResponse>(Urls.HOME, formData),
      onSuccess: ({data, StatusCode}) => {
        if (StatusCode === 200) {
          if (data.list_type === 'up') {
            setUpEventsList(data.event_list);
            setTotalCount(pre => ({
              ...pre,
              up: data.event_list.length.toString(),
            }));
          }
          if (data.list_type === 'prev') {
            setPreEventsList(data.event_list);
            setTotalCount(pre => ({
              ...pre,
              pre: data.event_list.length.toString(),
            }));
          }
          //
        } else {
          setPopupModal({
            state: true,
            title: `Error getting ${lable} ${type} events.${
              StatusCode ? ` [${StatusCode}]` : ''
            }`,
            disc: "We couldn't complete your request, please try again!",
            buttOne: 'LOGOUT',
            buttTwo: 'RETRY',
          });
        }
        setLoading(false);
      },
      onError: error => {
        setLoading(false);

        setPopupModal({
          state: true,
          title: `Error getting ${lable} ${type} events.${
            error?.StatusCode ? ` [${error.StatusCode}]` : ''
          }`,
          disc: error?.error?.description
            ? error.error.description
            : "We couldn't complete your request, please try again!",
          buttOne: 'LOGOUT',
          buttTwo: 'RETRY',
        });
      },
    });

    const onDismiss = useCallback(() => {
      setPopupModal({...popupModal, state: false});
    }, [popupModal.state]);

    const buttOnePress = useCallback(() => {
      if (popupModal.buttOne === 'LOGOUT') {
        setPopupModal({...popupModal, state: false});
        storage.clearAll();
      }
    }, [popupModal.state]);

    const buttTwoPress = useCallback(() => {
      if (popupModal.buttTwo === 'RETRY') {
        setPopupModal({...popupModal, state: false});
        callAPI();
      }
    }, [popupModal.state]);

    return (
      <Animated.View style={{}}>
        <Text
          style={{
            color: '#fff',
            marginVertical: 8,
            paddingHorizontal,
            textTransform: 'capitalize',
          }}
          variant={'SubTitleTwo'}>
          {lable === 'your' ? 'Hosted' : lable} Events
        </Text>
        <SelectionRow type={type} setType={setType} total={totalCount} />
        <EventsDisplay
          eventList={type === 'Previous' ? preEventsList : upEventsList}
          type={type}
          lable={lable}
          loading={loading}
          reload={callAPI}
        />
        <PopupCompo
          isVisible={popupModal.state}
          onDismiss={onDismiss}
          title={popupModal.title}
          disc={popupModal.disc}
          buttOne={popupModal.buttOne}
          buttTwo={popupModal.buttTwo}
          buttOnePress={buttOnePress}
          buttTwoPress={buttTwoPress}
        />
      </Animated.View>
    );
  },
);

const EventsDisplay = memo(
  ({
    eventList,
    type,
    lable,
    loading,
    reload,
  }: {
    eventList: eventItem[];
    type: EventTypeText;
    lable: EventListType;
    loading: boolean;
    reload: () => void;
  }) => {
    const navigation = useNavigation<MainStackNavigation>();

    const AddEvent = () => {
      storage.delete('SettingsData');
      navigation.navigate('EventCreation', {});
    };
    return loading ? (
      <View
        style={{
          // flexDirection: 'row',
          paddingVertical: 21,
          alignItems: 'center',
          // borderWidth: 1,
          flex: 1,
          // flexDirection: 'row',
          gap: 10,
        }}>
        <ActivityIndicator
          color="#fff"
          style={{alignSelf: 'center'}}
          size={'small'}
        />
        <Text variant={'BodyRegular'} style={{color: '#fff'}}>
          Getting Events ...
        </Text>
      </View>
    ) : (
      // eventList.length > 0 ?
      <Animated.ScrollView
        entering={FadeInLeft}
        exiting={FadeOutLeft}
        horizontal={true}
        contentContainerStyle={{
          paddingVertical: 14,
          paddingHorizontal: paddingHorizontal,
          alignItems: 'flex-start',
        }}>
        {eventList?.map((item, index) => (
          <EventView
            key={index}
            data={item}
            invited={lable !== 'your'}
            reload={reload}
          />
        ))}
        {lable === 'your' && (
          <AnimatedPressable
            style={{justifyContent: 'center'}}
            onPress={AddEvent}
            entering={FadeIn.delay(400)}>
            <NewEventBox width={width * 0.6} height={width * 0.6} />
            <Text
              variant={'SubTitleOne'}
              style={{
                color: '#fff',
                position: 'absolute',
                alignSelf: 'center',
              }}>
              + New Event
            </Text>
          </AnimatedPressable>
        )}
      </Animated.ScrollView>
      // ) : (

      //   <Animated.View
      //     style={{
      //       paddingVertical: 21,
      //       alignItems: 'center',
      //       // borderWidth: 1,
      //       flex: 1,
      //       // flexDirection: 'row',
      //     }}>
      //     <Text
      //       // entering={FadeInRight}
      //       // exiting={FadeOutLeft}
      //       style={{color: '#fff'}}
      //       variant={'SubTitleTwo'}>
      //       No {type} Events to display!
      //     </Text>
      //   </Animated.View>
    );
  },
);

const EventView = memo(
  ({
    data,
    invited,
    reload,
  }: {
    data: eventItem;
    invited: boolean;
    reload: () => void;
  }) => {
    const navigation = useNavigation<MainStackNavigation>();
    return (
      <Pressable
        style={{paddingHorizontal: width * 0.02}}
        onPress={() => {
          navigation.navigate('EventDetails', {
            id: data.evt_id,
            invited: invited,
            onGoBack: invited ? () => reload() : undefined,
          });
        }}>
        {/* {prev && (
          <Text
            style={{color: '#F9BC52', marginBottom: 4}}
            variant={'BodyBold'}>
            {`${data.eventStatus}`}
          </Text>
        )} */}
        {/*  */}
        <ImageCompo uri={data.pic} size={width * 0.6} />
        <Animated.View
          style={{
            paddingVertical: 4,
            gap: 8,
          }}>
          {/* {invited && (
            <Animated.View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {data.goingList.length > 0 && (
                <Animated.View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                  <Animated.View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {data.goingList.map((itm, idx) => (
                      <Animated.View
                        style={{
                          width:
                            idx + 1 ===
                            (data.goingList.length > 5
                              ? 5
                              : data.goingList.length)
                              ? 15
                              : 10,
                        }}>
                        <Image
                          source={{
                            uri: `https://avatar.iran.liara.run/username?username=${itm.name.replaceAll(
                              ' ',
                              '+',
                            )}`,
                          }}
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            borderColor: '#EDEDED',
                          }}
                        />
                      </Animated.View>
                    ))}
                  </Animated.View>
                  <Text variant={'DetailRegular'} style={{color: '#fff'}}>
                    {data.goingList[0].name}
                  </Text>
                  {data.goingList.length > 1 && (
                    <Text variant={'DetailRegular'} style={{color: '#fff'}}>
                      +{data.goingList.length - 1} more
                    </Text>
                  )}
                </Animated.View>
              )}
            </Animated.View>
          )} */}
          <Text variant={'SubTitleOne'} style={{color: '#fff'}}>
            {data.title}
          </Text>
          <Animated.View
            style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
            <Animated.View
              style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <CalenderSVG width={16} height={16} />
              <Text variant={'DetailRegular'} style={{color: '#EDEDED'}}>
                {data.date}
              </Text>
            </Animated.View>
            <Animated.View
              style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <ClockSVG width={16} height={16} />
              <Text variant={'DetailRegular'} style={{color: '#EDEDED'}}>
                {data.time}
              </Text>
            </Animated.View>
          </Animated.View>
          <StatusCompo goingStatus={data.goingStatus} />
        </Animated.View>
      </Pressable>
    );
  },
);

const StatusCompo = memo(({goingStatus}: {goingStatus: string}) => {
  return (
    <Animated.View
      style={{
        backgroundColor: '#FFFFFF1A',
        borderRadius: 10,
        padding: 10,
        gap: 6,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
      }}>
      {goingStatus === 'Y' && <ThumbsUpSVG width={20} height={20} />}
      {goingStatus === 'N' && (
        <ThumbsUpSVG
          style={{
            transform: [
              {
                rotate: '180deg',
              },
            ],
          }}
          width={20}
          height={20}
        />
      )}
      {goingStatus === 'M' && <QuesSVG width={20} height={20} />}
      <Text variant={'BodyRegular'} style={{color: '#fff'}}>
        {goingStatus === 'Y' && 'Going'}
        {goingStatus === 'N' && 'Not Going'}
        {goingStatus === 'M' && 'May Be'}
        {goingStatus === '' && 'Not Responsede Yet'}
      </Text>
    </Animated.View>
  );
});

const SelectionRow = memo(
  ({
    type,
    total,
    setType,
  }: {
    type: string;
    total: {up: string; pre: string};
    setType: (val: EventTypeText) => void;
  }) => {
    return (
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingVertical: 4,
          paddingHorizontal,
        }}>
        <SelectionItm
          key={'upcoming'}
          lable={'Upcoming'}
          count={total.up}
          type={type === 'Upcoming'}
          onPress={() => setType('Upcoming')}
        />
        <SelectionItm
          key={'previous'}
          lable={'Previous'}
          count={total.pre}
          type={type === 'Previous'}
          onPress={() => setType('Previous')}
        />
      </Animated.View>
    );
  },
);
const SelectionItm = memo(
  ({
    lable,
    count,
    type,
    onPress,
  }: {
    lable: string;
    count: string;
    type: boolean;
    onPress: () => void;
  }) => {
    return (
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          borderWidth: type ? 1 : 0,
          borderColor: '#fff',
          borderRadius: 100,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: '#C5B1C33D',
        }}
        onPress={onPress}>
        <Text variant={'BodyRegular'} style={{color: '#fff'}}>
          {lable}
        </Text>

        <Text variant={'BodyRegular'} style={{color: '#ffffff80'}}>
          {count}
        </Text>
      </Pressable>
    );
  },
);

const WelcomeCompo = memo(({name}: {name: string}) => {
  return (
    <Animated.View style={{paddingHorizontal, gap: 6}}>
      <Text variant={'SubTitleTwo'} style={{color: '#fff'}}>
        Welcome, {name}!
      </Text>
      <Text variant={'DetailBold'} style={{color: '#fff'}}>
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
        sint.
      </Text>
    </Animated.View>
  );
});

const SearchCompo = memo(() => {
  const [value, setValue] = useState('');
  return (
    <Animated.View style={{paddingHorizontal}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#C5B1C33D',
          borderRadius: 10,
          paddingHorizontal: 10,
          gap: 8,
        }}>
        <SearchSVG width={14} height={14} />
        <TextInput
          value={value}
          onChangeText={setValue}
          style={{
            flex: 1,
            paddingVertical: 4,
            fontFamily: 'PoppinsMedium',
            fontWeight: '500',
            letterSpacing: 0,
            fontSize: 14,
            lineHeight: 15,
            color: '#fff',
          }}
        />
      </View>
    </Animated.View>
  );
});

const ImageCompo = memo(({uri, size}: {uri: string | null; size: number}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Animated.View
      style={{
        borderWidth: 0.5,
        borderColor: '#ffffff1A',
        borderRadius: 10,
        marginVertical: 4,
      }}>
      {uri ? (
        <Image
          source={{uri}}
          style={{
            width: size,
            height: size,
            borderRadius: 10,
          }}
          onLoadStart={() => {
            setLoading(true);
          }}
          onLoadEnd={() => {
            setLoading(false);
          }}
        />
      ) : (
        <Animated.View
          style={{
            width: size,
            height: size,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#C5B1C380',
          }}>
          <Text style={{color: '#fff'}} variant={'BodyBold'}>
            No Image
          </Text>
        </Animated.View>
      )}
      {loading && (
        <ActivityIndicator
          color="#fff"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        />
      )}
    </Animated.View>
  );
});
