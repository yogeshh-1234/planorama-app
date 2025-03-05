import React, { memo, useEffect, useState } from 'react';
import {
  Clipboard,
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  Vibration,
  View,
} from 'react-native';
import { storage } from '../../functions/storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MainStackNavigation, RootStackParamList } from '../../navigation';
import { useMutation } from '@tanstack/react-query';
import {
  ErrorFormat,
  EventDetailsForm,
  EventDetailsType,
  EventGalleryResponse,
  EventResponse,
  galleryType,
} from './EveDetType';
import { postData } from '../../api';
import Urls from '../../api/urls';
import DetailsCompo from './DetailsCompo';
import LoadingCompo from '../../components/LoadingCompo';
import LinearGradient from 'react-native-linear-gradient';
import {
  CopySVG,
  EditSVG,
  MenuDotsSVG,
  QuesSVG,
  SettingSVG,
  ThumbsUpSVG,
  UsersSVG,
} from '../../assets/SVG/IconsSVG';
import Text from '../../components/Text';
import { MotiView, useAnimationState } from 'moti';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
} from 'react-native-reanimated';
import {
  EventGuestsForm,
  GuestEventResponse,
  guestItemType,
} from '../EventGuest/EventGuestType';
import { ActivityIndicator } from 'react-native-paper';
import Button from '../../components/Button';
import HeaderCompo from '../../components/HeaderCompo';
import CommentSection from './CommentSection';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { width, height } = Dimensions.get('screen');
const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
export default function () {
  const [loading, setLoading] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [popupModal, setPopupModal] = useState(PopupModal);

  const { params } = useRoute<RouteProp<RootStackParamList, 'EventDetails'>>();

  const [eventData, setEventData] = useState<EventDetailsType>({
    id: -1,
    cover_img: '',
    bg_img: '',
    name: '',
    color_hex: '',
    font_id: '',
    date: '',
    time: '',
    type: '',
    location: '',
    link: '',
    event_disc: '',
    rsvp: null,
    host_list: [],
    rsvp_guest_type: 'H', //H - host, G - guest
    rsvp_guest_approved: 'Y',
    accept_maybe: 'Y',
    open_event: '',
    rsvp_url: '',
    is_host: false,
    is_guest: false,
  });

  const [galleryData, setGalleyData] = useState<string[]>([]);

  useEffect(() => {
    mainFn();
  }, []);
  const mainFn = () => {
    callAPI({
      mode: 'VIEW_EVENT',
    });

    callAPI({
      mode: 'VIEW_GALLERY',
    });
  };

  //
  const callAPI = (data: { mode: string }) => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        token,
        id,
        event_id: params.id,
        ...data,
      };

      if (data.mode === 'VIEW_EVENT') {
        setLoading(true);
        eventMutation.mutate(formData);
      }
      if (data.mode === 'VIEW_GALLERY') {
        setGalleryLoading(true);
        galleryMutation.mutate(formData);
      }
    }
  };

  const eventMutation = useMutation<
    EventResponse,
    ErrorFormat,
    EventDetailsForm
  >({
    mutationFn: (formData: EventDetailsForm) =>
      postData<EventDetailsForm, EventResponse>(Urls.EVENT, formData),
    onSuccess: ({ data, StatusCode }) => {
      // console.log('data', data);
      StatusCode === 200 ? setEventData(data) : errorPopUp(StatusCode, null);
      setLoading(false);
    },
    onError: error => {
      setLoading(false);
      errorPopUp(error?.StatusCode, error?.error?.description);
    },
  });

  const galleryMutation = useMutation<
    EventGalleryResponse,
    ErrorFormat,
    EventDetailsForm
  >({
    mutationFn: (formData: EventDetailsForm) =>
      postData<EventDetailsForm, EventGalleryResponse>(Urls.EVENT, formData),
    onSuccess: ({ data, StatusCode }) => {
      StatusCode === 200
        ? setGalleyData(data.gallery?.map(itm => itm.pic))
        : errorPopUp(StatusCode, null);
      setGalleryLoading(false);
    },
    onError: error => {
      setGalleryLoading(false);
      errorPopUp(error?.StatusCode, error?.error?.description);
    },
  });

  const errorPopUp = (code: number, desc: string | null) => {
    setPopupModal({
      state: true,
      title: `Oops! Something went wrong.${code ? ` [${code}]` : ''}`,
      disc: desc
        ? desc
        : "We couldn't complete your request, please try again!",
      buttOne: 'LOGOUT',
      buttTwo: 'RETRY',
    });
  };
  const navigation = useNavigation<MainStackNavigation>();

  const onBack = () => {
    navigation.goBack();
  };

  const onShare = async () => {
    Clipboard.setString(eventData.rsvp_url);
    try {
      const result = await Share.share({
        message: eventData.rsvp_url,
        title: 'Share Event',
        url: eventData.rsvp_url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // console.log("Shared with", result.activityType);
        } else {
          // console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        // console.log("Share dismissed");
      }
    } catch (error) {
      // Alert.alert(error.message);
    }
  };

  const invitedEvent =
    (eventData.open_event === 'Y' || eventData.open_event === 'N') &&
    eventData.is_guest &&
    !eventData.is_host;

  const addOnList =
    eventData.open_event === 'Y' && !eventData.is_guest && !eventData.is_host;

  const showRSVPCompo = !loading && !invitedEvent && !addOnList;

  return (
    <View
      style={{
        backgroundColor: '#3A2537',
        flex: 1,
        paddingTop: StatusBar.currentHeight,
      }}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent
        barStyle={'light-content'}
      />
      <HeaderCompo
        onBack={onBack}
        showShare={
          eventData.rsvp_url && eventData.rsvp_url.length > 1 ? true : false
        }
        onShare={onShare}
      />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: invitedEvent ? 250 : 100,
          paddingHorizontal: width * 0.05,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={mainFn}
            title="Pull to refresh"
            colors={['#F2F2F2']}
            progressBackgroundColor={'#0E0E0E'}
            titleColor="grey"
          />
        }>
        {!loading && (
          <DetailsCompo
            title={eventData.name}
            fontId={eventData.font_id.toString()}
            cover_img={eventData.cover_img}
            bg_img={eventData.bg_img}
            colorHex={eventData.color_hex}
            date={eventData.date}
            time={eventData.time}
            location={
              eventData.location.length > 0
                ? eventData.location
                : eventData.link
            }
            isLink={eventData.location.length > 0 ? false : true}
            description={eventData.event_disc}
            rsvp={eventData.rsvp}
            hostList={eventData.host_list}
            gallery={galleryData}
            galleryLoading={galleryLoading}
            isAddOnList={addOnList}
          />
        )}
        <View
          style={{
            opacity: addOnList ? 0.4 : 1,
          }}>
          {!loading && (
            <GuestListCompo
              event_id={params.id}
              eventName={eventData.name}
              eventPic={eventData.cover_img}
              disable={invitedEvent}
            />
          )}

          {showRSVPCompo && <RSVPCompo value={eventData.rsvp} />}
          {!loading && !addOnList &&  !( eventData.open_event === 'Y' && eventData.rsvp_guest_approved === 'N' )   &&(
            <CommentSection
              isHost={eventData.is_host}
              eventID={params.id}
              guestId={eventData.rsvp_guest_id ? eventData.rsvp_guest_id : 0}
            />
          )}
          {addOnList && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: 'transparent',
              }}
            />
          )}
        </View>
      </ScrollView>

      {/* "rsvp_guest_approved": "N", */}
      {eventData.open_event === 'Y' && eventData.rsvp_guest_approved === 'N' ? (
        eventData.is_host ? (
          <></>
        ) : (
          <WaitingBanner />
        )
      ) : invitedEvent ? (
        <SelectRSVP
          value={eventData.rsvp}
          rsvpGuestId={eventData.rsvp_guest_id}
          eventID={params.id}
          eventName={eventData.name}
          hideMaybe={
            eventData.open_event === 'Y' ||
            (eventData.open_event === 'N' && eventData.accept_maybe === 'N')
          }
        />
      ) : (
        <></>
      )}

      {addOnList && <AddOnList eventID={params.id} reloadAPI={mainFn} />}
      {!loading && !invitedEvent && !addOnList && eventData.is_host && (
        <BottomBar
          eventID={params.id}
          eventData={eventData}
          galleryData={galleryData}
          disable={galleryLoading}
          reloadAPI={mainFn}
        />
      )}
      {loading && <LoadingCompo text={'Getting event details'} />}
    </View>
  );
}
const WaitingBanner = () => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#3A2537A1',
        paddingHorizontal: 20,
        marginBottom: 24,
      }}>
      <Button
        lable="Pending Approval"
        disabled={true}
        onPress={() => { }}
        buttonStyles={{
          backgroundColor: '#4F4F4F',
        }}
      />
    </View>
  );
};
type RSVPtype = 'Y' | 'N' | 'M' | null;

const SelectRSVP = memo(
  ({
    value,
    rsvpGuestId,
    eventID,
    eventName,
    hideMaybe = false,
  }: {
    value: RSVPtype;
    rsvpGuestId: number | undefined;
    eventID: number;
    eventName: string;
    hideMaybe?: boolean;
  }) => {
    const { params } = useRoute<RouteProp<RootStackParamList, 'EventDetails'>>();

    const navigation = useNavigation<MainStackNavigation>();

    const [RSVPval, setRSVPval] = useState<RSVPtype>(value);
    const [tempRSVPval, setTempRSVPval] = useState<RSVPtype>(null);
    const [loading, setLoading] = useState(false);

    const changeRVP = (val: RSVPtype) => {
      const token = storage.getString('user.token');
      const id = storage.getString('user.id');
      if (
        token !== null &&
        token !== undefined &&
        id !== null &&
        id !== undefined
      ) {
        const formData = {
          mode: 'UPDATE_GUESTS_RSVP',
          token,
          id,
          event_id: eventID,
          guest_id: rsvpGuestId,
          rsvp:
            val === 'Y'
              ? 'R~Y'
              : val === 'M'
                ? 'R~M'
                : val === 'N'
                  ? 'R~N'
                  : '',
        };
        setTempRSVPval(val);
        setLoading(true);
        // console.log('formData', formData);
        eventMutation.mutate(formData);
      }
    };

    const eventMutation = useMutation<
      GuestEventResponse,
      ErrorFormat,
      EventGuestsForm
    >({
      mutationFn: (formData: EventGuestsForm) =>
        postData<EventGuestsForm, GuestEventResponse>(Urls.EVENT, formData),
      onSuccess: ({ data, StatusCode }) => {
        // console.log('data', data);
        setTempRSVPval(null);
        if (StatusCode === 200) {
          setRSVPval(tempRSVPval);
          if (params.onGoBack) {
            // console.log('params.onGoBack');
            params.onGoBack();
          }
          navigation.navigate('SuccessScreen', {
            type: 'rsvp',
            textOne: `You have successfully sent your response to the event `,
            textTwo: eventName,
            textThree: '',
            eventID: eventID,
          });
        } else {
          ToastAndroid.showWithGravity(
            `Something went wrong, please try again! ${StatusCode} `,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }

        setLoading(false);
      },
      onError: error => {
        setTempRSVPval(null);
        ToastAndroid.showWithGravity(
          error?.error?.description
            ? `${error?.error?.description} ${error?.StatusCode}`
            : `Something went wrong, please try again! ${error?.StatusCode}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setLoading(false);
      },
    });

    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#3A2537A1',
          paddingHorizontal: 20,
        }}>
        <RSVPCompo
          value={RSVPval || value}
          onChange={
            loading
              ? null
              : val => {
                changeRVP(val);
              }
          }
          hideMaybe={hideMaybe}
        />
        {loading && <LoadingCompo text="Changing RSVP..." />}
      </View>
    );
  },
);
const BottomBar = memo(
  ({
    eventID,
    eventData,
    galleryData,
    disable,
    reloadAPI,
  }: {
    eventID: number;
    eventData: EventDetailsType;
    galleryData: string[];
    disable: boolean;
    reloadAPI: () => void;
  }) => {
    const navigation = useNavigation<MainStackNavigation>();
    const onSettings = () => {
      navigation.navigate('EventSettingsScreen', {
        eventID,
      });
    };
    const EditEvent = () => {
      if (disable) {
        ToastAndroid.showWithGravity(
          `Please wait!`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        navigation.navigate('EventCreation', {
          eventID,
          eventData,
          galleryData,
          onGoBack: () => {
            reloadAPI();
          },
        });
      }
    };
    const viewGuest = () => {
      navigation.navigate('EventGuest', {
        eventID,
        eventName: eventData.name,
        eventPic: eventData.cover_img,
      });
    };
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <LinearGradient
          colors={['transparent', '#3A2537']}
          locations={[0, 0.4]}
          style={{
            flexDirection: 'row',
          }}>
          <ButtonPress onPress={EditEvent} lable={'Edit'} icon={'edit'} />
          <ButtonPress onPress={viewGuest} lable={'Guests'} icon={'guest'} />
          <ButtonPress
            onPress={onSettings}
            lable={'Settings'}
            icon={'settings'}
          />
          <ButtonPress
            onPress={() => {
              ToastAndroid.showWithGravity(
                'Coming Soon',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
            }}
            lable={'More'}
            icon={'more'}
          />
        </LinearGradient>
      </View>
    );
  },
);
const ButtonPress = ({
  onPress,
  lable,
  icon,
}: {
  onPress: () => void;
  lable: string;
  icon: string;
}) => {
  const ICON = () => {
    switch (icon) {
      case 'edit':
        return <EditSVG width={30} height={30} />;
      case 'guest':
        return <UsersSVG width={30} height={30} />;
      case 'settings':
        return <SettingSVG width={30} height={30} />;
      case 'more':
        return <MenuDotsSVG width={30} height={30} />;

      default:
        return <></>;
    }
  };
  const buttState = useAnimationState({
    from: {
      scale: 1,
    },
    to: {
      scale: 1,
    },
    pressd: { scale: 0.95 },
  });
  return (
    <Pressable
      style={styles.bottomItm}
      onPress={onPress}
      onPressIn={() => buttState.transitionTo('pressd')}
      onPressOut={() => buttState.transitionTo('to')}>
      <MotiView
        style={{
          paddingVertical: 24,
          gap: 16,
          alignItems: 'center',
        }}
        entering={FadeInDown.delay(500)}
        exiting={FadeOutDown}
        state={buttState}>
        {ICON()}
        <Text variant={'DetailRegular'} style={{ color: '#fff' }}>
          {lable}
        </Text>
      </MotiView>
    </Pressable>
  );
};

const IconSize = width * 0.15;
const RSVPCompo = memo(
  ({
    value,
    onChange,
    hideMaybe,
  }: {
    value: 'Y' | 'N' | 'M' | null;
    onChange?: ((val: RSVPtype) => void) | null;
    hideMaybe: boolean;
  }) => {
    return (
      <View style={styles.rsvpRow}>
        {hideMaybe && <View style={{ flex: 0.25 }} />}
        <Pressable
          onPress={() => onChange && onChange('Y')}
          style={{
            ...styles.rsvpCompo,
            borderColor: value === 'Y' ? '#FFF' : '#C5B1C33D',
          }}>
          <ThumbsUpSVG width={IconSize} height={IconSize} fill={'#C5B1C3'} />
          <Text variant={'BodyRegular'} style={[styles.color_W]}>
            Going
          </Text>
        </Pressable>
        {hideMaybe ? (
          <View style={{ flex: 0.5 }} />
        ) : (
          <Pressable
            onPress={() => onChange && onChange('M')}
            style={{
              ...styles.rsvpCompo,
              borderColor: value === 'M' ? '#FFF' : '#C5B1C33D',
            }}>
            <QuesSVG width={IconSize} height={IconSize} fill={'#C5B1C3'} />
            <Text variant={'BodyRegular'} style={[styles.color_W, {}]}>
              May be
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => onChange && onChange('N')}
          style={{
            ...styles.rsvpCompo,
            borderColor: value === 'N' ? '#FFF' : '#C5B1C33D',
          }}>
          <ThumbsUpSVG
            width={IconSize}
            height={IconSize}
            fill={'#C5B1C3'}
            style={{
              transform: [{ scaleY: -1 }],
            }}
          />
          <Text variant={'BodyRegular'} style={[styles.color_W]}>
            No
          </Text>
        </Pressable>
        {hideMaybe && <View style={{ flex: 0.25 }} />}
      </View>
    );
  },
);

const ImgCount = 3;
const GuestListCompo = memo(
  ({
    event_id,
    eventName,
    eventPic,
    disable,
  }: {
    event_id: number;
    eventName: string;
    eventPic: string;
    disable: boolean;
  }) => {
    const navigation = useNavigation<MainStackNavigation>();

    const [loading, setLoading] = useState(false);
    const [eventGuest, setEventGuest] = useState<guestItemType[]>([]);
    const [error, setError] = useState('');
    const [going, setGoing] = useState(0);
    useEffect(() => {
      callAPI();
    }, []);

    //
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
          mode: 'VIEW_EVENT_GUEST',
          token,
          id,
          event_id,
        };
        setLoading(true);
        eventMutation.mutate(formData);
      }
    };

    const eventMutation = useMutation<
      GuestEventResponse,
      ErrorFormat,
      EventGuestsForm
    >({
      mutationFn: (formData: EventGuestsForm) =>
        postData<EventGuestsForm, GuestEventResponse>(Urls.EVENT, formData),
      onSuccess: ({ data, StatusCode }) => {
        // console.log(data);
        if (StatusCode === 200) {
          setEventGuest(data.guest_list);
          // console.log('check', data);
          setGoing(data.rsvp_cnt['R~Y']);
        } else {
          setError(`Something went wrong, please try again! ${StatusCode} `);
        }
        setLoading(false);
      },
      onError: error =>
        setError(
          error?.error?.description
            ? `${error?.error?.description} ${error?.StatusCode}`
            : `Something went wrong, please try again! ${error?.StatusCode}`,
        ),
    });

    return (
      <Pressable
        style={{
          flexDirection: 'row',
          // alignItems: 'center',
          paddingVertical: 8,
          gap: 12,
        }}
        onPress={
          disable
            ? null
            : () =>
              navigation.navigate('EventGuest', {
                eventID: event_id,
                eventName: eventName,
                eventPic: eventPic,
              })
        }>
        <View style={{ gap: 4 }}>
          <Text variant={'SubTitleTwo'} style={{ color: '#EDEDED' }}>
            Guest List
          </Text>
          {!loading && !(error.length > 0) && (
            <Text variant={'DetailRegular'} style={{ color: '#fff' }}>
              {eventGuest.length} Invited | {going} Going
            </Text>
          )}
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
          }}>
          {error.length > 0 && (
            <View
              style={{
                alignItems: 'flex-end',
                gap: 8,
              }}>
              <Text variant={'BodyBold'} style={{ color: 'red' }}>
                {error}
              </Text>
              <Pressable
                style={{
                  backgroundColor: '#C5B1C33D',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 100,
                }}
                onPress={() => {
                  setLoading(true);
                  setError('');
                  callAPI();
                }}>
                <Text variant={'BodyRegular'} style={{ color: '#fff' }}>
                  Retry
                </Text>
              </Pressable>
            </View>
          )}
          {eventGuest.filter(itm => itm.rsvp === `R~Y`).length > 0 && (
            <ImagesCompo
              guest={eventGuest
                .filter(itm => itm.rsvp === `R~Y`)
                .slice(0, ImgCount)}
              count={eventGuest.filter(itm => itm.rsvp === `R~Y`).length}
            />
          )}
        </View>
      </Pressable>
    );
  },
);

const ImagesCompo = ({
  guest,
  count,
}: {
  guest: guestItemType[];
  count: number;
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {guest.map((item, idx) => (
          <MemberImg
            pic={
              item.pic
                ? item.pic
                : `https://avatar.iran.liara.run/username?username=${item.name.replaceAll(
                  ' ',
                  '+',
                )}`
            }
            idx={idx}
            count={count}
            key={idx}
          />
        ))}
        {count > ImgCount && (
          <View
            style={{
              width: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                borderRadius: 40,
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff80',
              }}>
              <Text variant={'DetailRegular'} style={{ color: '#fff' }}>
                +{count - ImgCount}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const MemberImg = ({
  pic,
  idx,
  count,
}: {
  pic: string;
  idx: number;
  count: number;
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <View
      style={{
        width: idx + 1 === (count > ImgCount ? ImgCount : count) ? 40 : 30,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: idx * -100 + 500,
      }}>
      <Image
        source={{ uri: pic }}
        style={{
          borderRadius: 100,
          width: 40,
          height: 40,
        }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <ActivityIndicator
          color="#fff"
          style={{
            position: 'absolute',
          }}
        />
      )}
    </View>
  );
};

const AddOnList = ({
  eventID,
  reloadAPI,
}: {
  eventID: number;
  reloadAPI: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const changeRVP = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        mode: 'ADD_GUEST_SELF',
        token,
        id,
        event_id: eventID,
      };
      setLoading(true);
      // console.log('formData', formData);
      mutation.mutate(formData);
    }
  };
  const mutation = useMutation<
    GuestEventResponse,
    ErrorFormat,
    EventGuestsForm
  >({
    mutationFn: (formData: EventGuestsForm) =>
      postData<EventGuestsForm, GuestEventResponse>(Urls.EVENT, formData),
    onSuccess: ({ data, StatusCode }) => {
      // console.log(data);
      if (StatusCode === 200) {
        reloadAPI();
      } else {
        ToastAndroid.showWithGravity(
          `Something went wrong, please try again! ${StatusCode} `,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }

      setLoading(false);
    },
    onError: error => {
      ToastAndroid.showWithGravity(
        error?.error?.description
          ? `${error?.error?.description} ${error?.StatusCode}`
          : `Something went wrong, please try again! ${error?.StatusCode}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setLoading(false);
    },
  });

  return (
    <Button
      lable="Get on the list"
      onPress={changeRVP}
      buttonStyles={{
        backgroundColor: '#F9BC52',
        alignSelf: 'center',
        marginBottom: 24,
      }}
      loading={loading}
      disabled={loading}
    />
  );
};

const styles = StyleSheet.create({
  bottomItm: {
    flex: 1,
    // paddingVertical: 24,
    // gap: 16,
    // alignItems: 'center',
  },
  rsvpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 21,
  },
  rsvpCompo: {
    alignItems: 'center',
    gap: 12,
    flex: 1,
    backgroundColor: '#C5B1C33D',
    borderRadius: 20,
    paddingVertical: 24,
    borderWidth: 5,
  },
  color_W: {
    color: '#fff',
    lineHeight: 24,
  },
});
