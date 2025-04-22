import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {memo, useEffect, useState} from 'react';
import {MainStackNavigation, RootStackParamList} from '../../navigation';
import {
  ErrorFormat,
  EventGuestsForm,
  GuestEventResponse,
  GuestEventResponseData,
  guestItemType,
} from './EventGuestType';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {postData} from '../../api';
import Urls from '../../api/urls';
import {Dimensions, Pressable, StatusBar, View} from 'react-native';
import LoadingCompo from '../../components/LoadingCompo';
import {BGline} from '../../assets/SVG/VectorSVG';
import HeaderCompo from '../../components/HeaderCompo';
import Text from '../../components/Text';
import ManageGuest from './ManageGuest';
import WhatsAppLogo from '../../components/WhatsAppLogo';
import {
  connectionForm,
  connectionResponce,
  profileError,
} from '../Profile/ProfileTypes';
import Button from '../../components/Button';
const {width, height} = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};

const paddingHorizontal = width * 0.05;
export default function () {
  const navigation = useNavigation<MainStackNavigation>();

  const [loading, setLoading] = useState(false);
  const [popupModal, setPopupModal] = useState(PopupModal);

  const {params} = useRoute<RouteProp<RootStackParamList, 'EventGuest'>>();

  const [eventGuest, setEventGuest] = useState<guestItemType[]>([]);

  const [allGuestData, setAllGuestData] = useState<GuestEventResponseData>({
    guest_list: [],
    rsvp_cnt: {},
    event: {
      open_event: '',
      max_capacity: 0,
      guest_approval: '',
      additional_guests: 0,
    },
    INVITE_RSVP_DD_ARR: [],
  });

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
        event_id: params.eventID,
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
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        // console.log(data.INVITE_RSVP_DD_ARR)

        setAllGuestData(data);
        setEventGuest(data.guest_list);
        if (!(data.guest_list.length > 0)) {
          addGuest();
        }
      } else {
        errorPopUp(StatusCode, null);
      }

      setLoading(false);
    },
    onError: error => errorPopUp(error?.StatusCode, error?.error?.description),
  });

  const errorPopUp = (code: number, desc: string | null) => {
    setLoading(false);
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

  const onBack = () => {
    navigation.goBack();
  };

  const addGuest = () => {
    navigation.navigate('ContactsScreen', {
      eventID: params.eventID,
      onGoBack: () => callAPI(),
      fromGuest: true,
      eventName: params.eventName,
      eventPic: params.eventPic,
    });
  };

  const addresssBook = () => {
    navigation.navigate('ImportContacts', {
      onGoBack: () => callAPI(),
    });
  };

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
      <HeaderCompo onBack={onBack} />

      <View
        style={{
          paddingTop: 14,
          gap: 14,
          flex: 1,
        }}>
        <View
          style={{
            paddingHorizontal,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            variant={'TitleTwo'}
            style={{
              color: '#fff',
              // paddingVertical: 12,
            }}>
            Manage guests
          </Text>
        </View>
        <View style={{gap: 8, marginBottom: 6}}>
          <Text
            variant={'SubTitleTwo'}
            style={{color: '#fff', alignSelf: 'center', textAlign: 'center'}}>
            Import from
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: width * 0.05,
              justifyContent: 'space-between',
            }}>
            <Button
              lable="Previously Invited"
              onPress={addGuest}
              buttonStyles={{
                backgroundColor: '#F9BC52',
                borderWidth: 1,
                borderColor: '#EDEDED',
                width: width * 0.43,
                paddingHorizontal: 14,
              }}
              small
            />
            <Button
              lable="Address book"
              onPress={addresssBook}
              buttonStyles={{
                backgroundColor: '#75486F',
                borderWidth: 1,
                borderColor: '#EDEDED',
                width: width * 0.43,
                paddingHorizontal: 14,
              }}
              small
            />
          </View>
        </View>
        {eventGuest.length > 0 ? (
          <ManageGuest
            eventID={params.eventID}
            onReload={callAPI}
            eventName={params.eventName}
            eventPic={params.eventPic}
            allGuestData={allGuestData}
          />
        ) : (
          <></>
        )}
      </View>

      {loading && <LoadingCompo text={'Getting event guest'} />}
    </View>
  );
}
