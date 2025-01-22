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
      StatusCode === 200
        ? setEventGuest(data.guest_list)
        : errorPopUp(StatusCode, null);
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
          paddingTop: 30,
          gap: 18,
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
            }}>
            Manage guests
          </Text>
          <Pressable
            style={{
              paddingVertical: 12,
              paddingHorizontal: 4,
            }}
            onPress={() => {

              navigation.navigate('ContactsScreen', {
                eventID: params.eventID,
                fromGuest: true,
                onGoBack: () => {
                  callAPI();
                },
              });
            }}>
            <Text
              variant={'DetailRegular'}
              style={{
                color: '#fff',
              }}>
              + Add guests
            </Text>
          </Pressable>
        </View>

        <ManageGuest
          eventGuest={eventGuest}
          eventID={params.eventID}
          onReload={callAPI}
          eventName={params.eventName}
        />
      </View>

      {loading && <LoadingCompo text={'Getting event guest'} />}
    </View>
  );
}

