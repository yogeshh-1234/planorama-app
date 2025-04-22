import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {BGline} from '../../assets/SVG/VectorSVG';
import HeaderCompo from '../../components/HeaderCompo';
import Text from '../../components/Text';
import Button from '../../components/Button';
import {
  CloseSVG,
  DownSVG,
  EditSVG,
  SearchSVG,
  ShareSVG,
} from '../../assets/SVG/IconsSVG';
import TextInput from '../../components/TextInput';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {
  cantactViewResponse,
  contactType,
  contactViewForm,
  errorType,
  importContactResponse,
  importGuestForm,
} from './contactsType';
import Urls from '../../api/urls';
import {postData} from '../../api';
import PopupCompo from '../../components/PopupCompo';
import LoadingCompo from '../../components/LoadingCompo';
import {
  guestListType,
  MainStackNavigation,
  RootStackParamList,
} from '../../navigation';
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import ContsctsList from './ContsctsList';
import {ItemType} from './ContactsScreen';
import LottieView from 'lottie-react-native';
import Animated, {
  FadeIn,
  FadeOut,
  FadeOutRight,
  LightSpeedOutRight,
  SlideOutRight,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {
  connectionForm,
  connectionResponce,
  profileError,
} from '../Profile/ProfileTypes';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const {width, height} = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

export default function () {
  const {params} = useRoute<RouteProp<RootStackParamList, 'ContactsScreen'>>();

  const fromEvents = params.eventID === -1 ? false : true;
  const navigation = useNavigation<MainStackNavigation>();

  const [loading, setLoading] = useState(false);
  // console.log('params', params);
  return (
    <View
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
      <View>
        {params?.eventName && (
          <Text
            variant={'SubTitleTwo'}
            style={{
              color: '#fff',
              alignSelf: 'center',
              textAlign: 'center',

              paddingHorizontal: 20,
              marginTop: 14,
            }}
            numberOfLines={1}>
            {params.eventName}
          </Text>
        )}
      </View>
      <HeaderCompo />
      <View
        style={{
          paddingHorizontal: width * 0.05,
          gap: 18,
          flex: 1,
        }}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            variant={'TitleTwo'}
            style={{
              color: '#fff',
            }}
            entering={FadeIn}
            exiting={FadeOut}>
            Previously Invited
          </Text>
          {!fromEvents && (
            <Button
              onPress={() => {
                navigation.navigate('ImportContacts', {
                  onGoBack: () => {
                    setLoading(pre => !pre);
                  },
                });
              }}
              lable="Address book"
              buttonStyles={{
                paddingHorizontal: 12,
                width: 'auto',
                backgroundColor: 'transparent',
                borderColor: '#EDEDED',
                borderWidth: 1,
              }}
              small
              variant="BodyRegular"
            />
          )}
        </Animated.View>

        {/* <View>
          <FiltersTab />
        </View> */}
        <ContactList
          justToReload={loading}
          eventID={params.eventID}
          fromGuest={params.fromGuest}
        />
      </View>
    </View>
  );
}

const FiltersTab = memo(() => {
  return (
    <Animated.View
      entering={FadeIn.delay(300)}
      exiting={FadeOut}
      style={{
        // flexDirection: 'row',
        // alignItems: 'center',
        // gap: 20,
        flex: 1,
      }}>
      <Text variant={'DetailRegular'} style={{color: '#fff'}}>
        Events
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          // flex: 1,
          backgroundColor: '#C5B1C33D',
          borderRadius: 5,
          padding: 12,
        }}>
        <Text variant={'DetailRegular'} style={{color: '#fff'}}>
          {""}
        </Text>
        <DownSVG fill={'#fff'} width={12} height={12} />
      </View>
    </Animated.View>
  );
});

const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
const ContactList = memo(
  ({
    justToReload,
    eventID,
    fromGuest,
  }: {
    justToReload: boolean;
    eventID: number;
    fromGuest: boolean | undefined;
  }) => {
    const {params} =
      useRoute<RouteProp<RootStackParamList, 'ContactsScreen'>>();

    const navigation = useNavigation<MainStackNavigation>();
    const fromEvents = eventID === -1 ? false : true;
    const [contacts, setContacts] = useState<contactType[]>([]);

    const [selectedItems, setSelectedItems] = useState<ItemType>({}); // Object to store selected items

    const [edit, setEdit] = useState(false);
    const [value, setValue] = useState('');

    const [loading, setLoading] = useState({
      status: false,
      text: '',
    });

    const [popupModal, setPopupModal] = useState(PopupModal);
    useEffect(() => {
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
          mode: 'VIEW_CONTACTS',
          token,
          id,
        };
        setLoading({
          status: true,
          text: 'Getting Contact List',
        });
        mutation.mutate(formData);
      }
    };

    const mutation = useMutation<
      cantactViewResponse,
      errorType,
      contactViewForm
    >({
      mutationFn: (formData: contactViewForm) =>
        postData<contactViewForm, cantactViewResponse>(Urls.PROFILE, formData),
      onSuccess: ({data, StatusCode}) => {
        if (StatusCode === 200) {
          setContacts(
            data.contact_list.map(itm => ({
              id: itm.id.toString(),
              name: itm.name,
              number: itm.number,
              pic: itm.pic,
            })),
          );
        } else {
          setPopupModal({
            state: true,
            title: `Oops! Something went wrong.${
              StatusCode ? ` [${StatusCode}]` : ''
            }`,
            disc: "We couldn't complete your request, please try again!",
            buttOne: 'BACK',
            buttTwo: 'RETRY',
          });
        }
        setLoading({
          status: false,
          text: '',
        });
      },
      onError: error => {
        setLoading({
          status: false,
          text: '',
        });

        setPopupModal({
          state: true,
          title: `Oops! Something went wrong.${
            error?.StatusCode ? ` [${error.StatusCode}]` : ''
          }`,
          disc: error?.error?.description
            ? error.error.description
            : "We couldn't complete your request, please try again!",
          buttOne: 'BACK',
          buttTwo: 'RETRY',
        });
      },
    });

    const onDismiss = useCallback(() => {
      // setPopupModal({...popupModal, state: false});
    }, [popupModal.state]);

    const buttOnePress = useCallback(() => {
      if (popupModal.buttOne === 'BACK') {
        setPopupModal({...popupModal, state: false});
      }
    }, [popupModal.state]);

    const buttTwoPress = useCallback(() => {
      if (popupModal.buttTwo === 'RETRY') {
        setPopupModal({...popupModal, state: false});
        callAPI();
      }
    }, [popupModal.state]);

    const filteredData = contacts.filter(
      item =>
        `${item?.name}`.toLowerCase().includes(value.trim().toLowerCase()) ||
        `${item?.number}`.includes(value.trim()),
    );

    // upload contacts
    const addContactsToEvent = () => {
      const selectedItms = Object.keys(selectedItems).map(itm => parseInt(itm));
      if (selectedItms.length > 0) {
        const token = storage.getString('user.token');
        const id = storage.getString('user.id');
        if (
          token !== null &&
          token !== undefined &&
          id !== null &&
          id !== undefined
        ) {
          const formData = {
            mode: 'ADD_GUESTS',
            token,
            id,
            event_id: eventID,
            guests_ids: JSON.stringify(selectedItms),
          };
          setLoading({
            status: true,
            text: `Adding ${selectedItms.length} Contacts...`,
          });
          mutationEvent.mutate(formData);
        }
      }
    };

    const mutationEvent = useMutation<
      importContactResponse,
      errorType,
      importGuestForm
    >({
      mutationFn: (formData: importGuestForm) =>
        postData<importGuestForm, importContactResponse>(Urls.EVENT, formData),
      onSuccess: ({data, StatusCode}) => {
        if (StatusCode === 200) {
          //
          ToastAndroid.showWithGravity(
            `${Object.keys(selectedItems).length} guest added to the event!`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );

          if (fromGuest === true) {
            if (params.onGoBack) params.onGoBack();
            navigation.goBack();
          } else {
            navigation.goBack();
          }
        } else {
          setLoading({
            status: false,
            text: '',
          });
          setPopupModal({
            state: true,
            title: `Oops! Something went wrong.${
              StatusCode ? ` [${StatusCode}]` : ''
            }`,
            disc: "We couldn't complete your request, please try again!",
            buttOne: 'BACK',
            buttTwo: 'RETRY',
          });
        }
      },
      onError: (error: errorType) => {
        setLoading({
          status: false,
          text: '',
        });

        setPopupModal({
          state: true,
          title: `Oops! Something went wrong.${
            error?.StatusCode ? ` [${error.StatusCode}]` : ''
          }`,
          disc: error?.error?.description
            ? error.error.description
            : "We couldn't complete your request, please try again!",
          buttOne: 'BACK',
          buttTwo: 'RETRY',
        });
      },
    });

    return (
      <View
        style={{
          flex: 1,
        }}>
        {(filteredData.length > 0 || value.length > 0) && (
          <Animated.View
            entering={FadeIn.delay(200)}
            exiting={FadeOut}
            style={{
              paddingBottom: 12,
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 6,
            }}>
            <Animated.View style={{flex: 1}}>
              <TextInput
                iconName="search"
                onRightButt={() => setValue('')}
                value={value}
                onChangeText={setValue}
                iconsize={16}
                textInputStyle={{
                  fontFamily: 'PoppinsMedium',
                  fontWeight: '500',
                  letterSpacing: 0,
                  fontSize: 14,
                  lineHeight: 18.2,
                  paddingVertical: 6,
                }}
                textInputProps={{
                  placeholder: 'Find a guest....',
                  placeholderTextColor: '#ffffff80',
                }}
              />
            </Animated.View>
            <FiltersTab />
          </Animated.View>
        )}

        {loading.status ? (
          <View
            style={{
              // backgroundColor: '#ffffff80',
              alignItems: 'center',
              justifyContent: 'center',
              width: width * 0.8,
              height: 100,
              borderRadius: 10,
            }}>
            <LottieView
              source={require('../../assets/lottie/loading.lottie')}
              style={{width: '100%', height: '100%'}}
              autoPlay
              loop
            />
            <Text
              variant={'BodyRegular'}
              style={{color: '#fff', alignSelf: 'center', textAlign: 'center'}}>
              {loading.text}
            </Text>
          </View>
        ) : (
          <ContsctsList
            staticData={fromEvents ? false : true}
            selectedItems={selectedItems}
            setSelectedItems={(val: any) => setSelectedItems(val)}
            contacts={filteredData}
            delay={0}
          />
        )}

        {fromEvents && !loading.status && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 12,
            }}>
            <Button
              lable="ADD TO EVENT"
              textStyles={{
                color: '#2D2D2D',
              }}
              buttonStyles={{
                backgroundColor: '#F9BC52',
                borderRadius: 10,
                // width: width * 0.42,
              }}
              onPress={addContactsToEvent}
            />
            {/* <InviteButton selectedItems={selectedItems} /> */}
          </View>
        )}

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
        {/* {loading.status && <LoadingCompo text={loading.text} />} */}
      </View>
    );
  },
);

const InviteButton = memo(({selectedItems}: {selectedItems: ItemType}) => {
  const navigation = useNavigation<MainStackNavigation>();

  const {params} = useRoute<RouteProp<RootStackParamList, 'ContactsScreen'>>();
  const [loading, setLoading] = useState(false);

  const checkInvite = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (token && id) {
      const formData = {
        mode: 'CHECK_CONNECTION',
        token,
        id,
      };
      setLoading(true);
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<
    connectionResponce,
    profileError,
    connectionForm
  >({
    mutationFn: (formData: connectionForm) =>
      postData<connectionForm, connectionResponce>(Urls.WHATSAPP, formData),
    onSuccess: ({data: {status}, StatusCode}) => {
      // console.log(status);
      StatusCode === 200
        ? status
          ? onSendMsg()
          : ToastAndroid.showWithGravity(
              `Whatsapp not connected!`,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            )
        : errorPopUp(StatusCode, null);
      setLoading(false);
    },
    onError: error => errorPopUp(error?.StatusCode, error?.error?.description),
  });
  const errorPopUp = (code: number, desc: string | null) => {
    setLoading(false);
    ToastAndroid.showWithGravity(
      `${desc ? desc : "We couldn't complete your request, please try again!"}${
        code ? ` [${code}]` : ''
      }`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const onSendMsg = () => {
    const selectedItms = Object.keys(selectedItems).map(itm => parseInt(itm));
    // console.log('selectedItms', selectedItms);
    if (selectedItms.length > 0) {
      let guestList: guestListType[] = [];
      Object.keys(selectedItems).forEach(function (key, index) {
        guestList = [
          ...guestList,
          {
            ...selectedItems[key],
            id: key,
          },
        ];
      });
      // console.log({
      //   guestList,
      //   eventID: params.eventID,
      //   eventName: params.eventName,
      //   eventPic: params.eventPic,
      // });
      navigation.navigate('SendMsgScreen', {
        guestList,
        eventID: params.eventID,
        eventName: `${params.eventName}`,
        eventPic: `${params.eventPic}`,
      });
    }
  };

  return (
    <Button
      lable="INVITE"
      textStyles={{
        color: '#2D2D2D',
      }}
      buttonStyles={{
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: width * 0.42,
      }}
      onPress={checkInvite}
      icon={() => <ShareSVG width={12} height={12} />}
      loading={loading}
    />
  );
});

const RemoveContacts = memo(
  ({
    selectedItems,
    onReload,
  }: {
    selectedItems: ItemType;
    onReload: () => void;
  }) => {
    const [loading, setLoading] = useState(false);

    const removeContacts = () => {
      const selectedItms = Object.keys(selectedItems).map(itm => parseInt(itm));
      if (selectedItms.length > 0) {
        const token = storage.getString('user.token');
        const id = storage.getString('user.id');
        if (
          token !== null &&
          token !== undefined &&
          id !== null &&
          id !== undefined
        ) {
          const formData = {
            mode: 'DELETE_CONTACTS',
            token,
            id,
            contacts_ids: JSON.stringify(selectedItms),
          };
          setLoading(true);
          mutation.mutate(formData);
        }
      }
    };
    const mutation = useMutation<
      importContactResponse,
      errorType,
      importGuestForm
    >({
      mutationFn: (formData: importGuestForm) =>
        postData<importGuestForm, importContactResponse>(
          Urls.PROFILE,
          formData,
        ),
      onSuccess: ({data, StatusCode}) => {
        if (StatusCode === 200) {
          //
          onReload();
        } else {
          ToastAndroid.showWithGravity(
            `Oops! Something went wrong.${
              StatusCode ? ` [${StatusCode}]` : ''
            }`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
        setLoading(false);
      },
      onError: (error: errorType) => {
        setLoading(false);
        ToastAndroid.showWithGravity(
          error?.error?.description
            ? error.error.description
            : "We couldn't complete your request, please try again!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      },
    });
    return (
      <AnimatedPressable
        entering={ZoomIn}
        exiting={FadeOutRight}
        style={{
          backgroundColor: '#C71D40',
          borderRadius: 4,
          height: 36,
          justifyContent: 'center',
          paddingHorizontal: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
        disabled={loading}
        onPress={removeContacts}>
        {loading && <ActivityIndicator color={'#fff'} />}
        <Text style={{color: '#fff'}} variant={'BodyRegular'}>
          Remove
        </Text>
      </AnimatedPressable>
    );
  },
);
