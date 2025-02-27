import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {MainStackNavigation, RootStackParamList} from '../../navigation';
import {BGline} from '../../assets/SVG/VectorSVG';
import HeaderCompo from '../../components/HeaderCompo';
import Text from '../../components/Text';
import {DownSVG, QuesSVG, UsersSVG} from '../../assets/SVG/IconsSVG';
import Switch from '../../components/Switch';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
} from 'react-native-reanimated';
import SelectDropdown from 'react-native-select-dropdown';
import RSVPsettings from './component/RSVPsettings';
import Questionnaire from './component/Questionnaire';
import PopupCompo from '../../components/PopupCompo';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {
  ErrorFormat,
  EventDetailsForm,
  RSVPResponce,
  RSVPResponceData,
  RSVPSubmitForm,
  sendRSVPSuccess,
} from './EveDetType';
import Urls from '../../api/urls';
import {postData} from '../../api';
import LoadingCompo from '../../components/LoadingCompo';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const {width, height} = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
type topTabType = 'RSVP' | 'Ques';
const paddingHorizontal = width * 0.05;
const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
export default function () {
  const {params} =
    useRoute<RouteProp<RootStackParamList, 'EventSettingsScreen'>>();

  const navigation = useNavigation<MainStackNavigation>();

  const [topTab, setTopTab] = useState<topTabType>('RSVP');

  const [popupModal, setPopupModal] = useState(PopupModal);
  const [loading, setLoading] = useState({status: false, text: ''});

  const [settingsData, setSettingsData] = useState<RSVPResponceData | null>(
    null,
  );

  useEffect(() => {
    // from event creation

    // from event view
    // call api get
    if (params?.eventID) {
      callAPI();
    } else {
      const TempSettingsData = storage.getString('SettingsData');
      if (TempSettingsData !== null && TempSettingsData !== undefined) {
        const toSetData = {
          ...JSON.parse(TempSettingsData),
        };
        setSettingsData(toSetData);
      } else {
        setSettingsData({
          id: 0,
          accept_rsvp: 'Y',
          rsvp_url: null,
          accept_maybe: 'Y',
          rsvp_button_style: 0,
          show_count_guests: 'Y',
          open_event: 'Y',
          max_capacity: 0,
          guest_approval: 'Y',
          additional_guests: 0,
          activity_timeline: 'Y',
          guest_status_share: 'Y',
          guest_posts: 'Y',
          guest_upload: 'Y',
        });
      }
    }
  }, []);

  //
  const callAPI = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined &&
      params.eventID !== undefined
    ) {
      const formData = {
        mode: 'VIEW_EVENT_CONFIG',
        token,
        id,
        event_id: params.eventID,
      };
      setLoading({status: true, text: 'Getting RSVP Settings!'});
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<RSVPResponce, ErrorFormat, EventDetailsForm>({
    mutationFn: (formData: EventDetailsForm) =>
      postData<EventDetailsForm, RSVPResponce>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      // console.log('data', data);
      StatusCode === 200
        ? setSettingsData(data)
        : errorPopUp(StatusCode, null, 'BACK');
      setLoading({status: false, text: ''});
    },
    onError: error => {
      errorPopUp(error?.StatusCode, error?.error?.description, 'BACK');
    },
  });
  const errorPopUp = (code: number, desc: string | null, buttTxt: string) => {
    setLoading({status: false, text: ''});
    setPopupModal({
      state: true,
      title: `Oops! Something went wrong.${code ? ` [${code}]` : ''}`,
      disc: desc
        ? desc
        : "We couldn't complete your request, please try again!",
      buttOne: buttTxt,
      buttTwo: 'RETRY',
    });
  };
  const onDismiss = useCallback(() => {
    setPopupModal({...popupModal, state: false});
  }, [popupModal.state]);

  const buttOnePress = useCallback(() => {
    if (popupModal.buttOne === 'BACK' && popupModal.buttTwo === 'RETRY') {
      navigation.goBack();
    } else if (popupModal.buttOne === '' && popupModal.buttTwo === 'RETRY') {
      setPopupModal({...popupModal, state: false});
    } else if (popupModal.buttOne === 'BACK' && popupModal.buttTwo === 'SAVE') {
      navigation.goBack();
    }
  }, [popupModal.state]);

  const buttTwoPress = useCallback(() => {
    if (popupModal.buttOne === 'BACK' && popupModal.buttTwo === 'RETRY') {
      callAPI();
    } else if (popupModal.buttOne === '' && popupModal.buttTwo === 'RETRY') {
      sendData();
    } else if (popupModal.buttOne === 'BACK' && popupModal.buttTwo === 'SAVE') {
      sendData();
    }
  }, [popupModal.state]);

  const onBack = () => {
    setPopupModal({
      state: true,
      title: `Save Changes!`,
      disc: 'Do you want to save the changes?',
      buttOne: 'BACK',
      buttTwo: 'SAVE',
    });
  };
  const handleSettingsDataChange = (updatedData: RSVPResponceData) => {
    setSettingsData(updatedData);
  };
  //
  const sendData = () => {
    if (settingsData !== null) {
      if (params?.eventID) {
        const token = storage.getString('user.token');
        const id = storage.getString('user.id');
        if (
          token !== null &&
          token !== undefined &&
          id !== null &&
          id !== undefined
        ) {
          const formData = {
            ...settingsData,
            mode: 'UPDATE_EVENT_CONFIG',
            token,
            id,
            event_id: params?.eventID,
          };
          // console.log('check', formData)
          setLoading({status: true, text: 'Setting RSVP Settings!'});
          mutationSend.mutate(formData);
        }
      } else {
        const tosetData = JSON.stringify(settingsData);
        storage.set('SettingsData', tosetData);
        navigation.goBack();
      }
    }
  };

  const mutationSend = useMutation<
    sendRSVPSuccess,
    ErrorFormat,
    RSVPSubmitForm
  >({
    mutationFn: (formData: RSVPSubmitForm) =>
      postData<RSVPSubmitForm, sendRSVPSuccess>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      StatusCode === 200
        ? //
          navigation.goBack()
        : errorPopUp(StatusCode, null, '');
      setLoading({status: false, text: ''});
    },
    onError: error => {
      errorPopUp(error?.StatusCode, error?.error?.description, '');
    },
  });

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
      <HeaderCompo
        showSave={true}
        onSave={() => {
          sendData();
        }}
        onBack={onBack}
      />
      <View
        style={{
          // paddingTop: 30,
          gap: 8,
          flex: 1,
        }}>
        <View
          style={{
            paddingHorizontal,
          }}>
          <Text
            variant={'TitleTwo'}
            style={{
              color: '#fff',
            }}>
            Settings
          </Text>
        </View>
        <TopTabs topTab={topTab} setTopTab={setTopTab} />
        {topTab === 'RSVP' && settingsData !== null && (
          <RSVPsettings
            settingsData={settingsData}
            onDataChange={handleSettingsDataChange}
          />
        )}
        {topTab === 'Ques' && <Questionnaire />}
      </View>
      {loading.status && <LoadingCompo text={loading.text} />}
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
    </View>
  );
}
const TopTabs = memo(
  ({
    topTab,
    setTopTab,
  }: {
    topTab: topTabType;
    setTopTab: (val: topTabType) => void;
  }) => {
    return (
      <View style={style.topRow}>
        <AnimatedPressable
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            style.topTabButt,
            {
              borderBottomWidth: topTab === 'RSVP' ? 1 : 0,
            },
          ]}
          onPress={() => setTopTab('RSVP')}>
          <UsersSVG
            fill={topTab === 'RSVP' ? '#fff' : '#ffffff80'}
            width={20}
            height={20}
          />
          <Text
            variant={'SubTitleOne'}
            style={{
              color: topTab === 'RSVP' ? '#fff' : '#ffffff80',
            }}>
            RSVP
          </Text>
        </AnimatedPressable>
        <AnimatedPressable
          entering={FadeIn.delay(400)}
          exiting={FadeOut}
          style={[
            style.topTabButt,
            {
              borderBottomWidth: topTab === 'Ques' ? 1 : 0,
            },
          ]}
          onPress={() => setTopTab('Ques')}>
          <View
            style={{
              backgroundColor: topTab === 'Ques' ? '#fff' : '#ffffff80',
              borderRadius: 100,
              padding: 4,
            }}>
            <QuesSVG fill={'#75486F'} width={12} height={12} />
          </View>
          <Text
            variant={'SubTitleOne'}
            style={{
              color: topTab === 'Ques' ? '#fff' : '#ffffff80',
            }}>
            Questionnaire
          </Text>
        </AnimatedPressable>
      </View>
    );
  },
);

const style = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 12,
    paddingHorizontal,
    // borderWidth:1
  },
  topTabButt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,

    borderColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
