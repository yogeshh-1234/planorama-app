import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  ToastAndroid,
  View,
} from 'react-native';
import {BGline} from '../../assets/SVG/VectorSVG';
import Header from '../Dashboard/components/Header';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation';
import {
  CloseSVG,
  ConnectSVG,
  EditSVG,
  LogoutSVG,
  MailSVG,
  WASVG,
} from '../../assets/SVG/IconsSVG';
import Text from '../../components/Text';
import HeaderCompo from '../../components/HeaderCompo';
import {storage} from '../../functions/storage';
import {dashError} from '../Dashboard/dashTypes';
import {useMutation} from '@tanstack/react-query';
import {postData} from '../../api';
import Urls from '../../api/urls';
import LoadingCompo from '../../components/LoadingCompo';
import Modal from 'react-native-modal';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import {
  WAmessageResponse,
  connectionForm,
  connectionResponce,
  logoutForm,
  logoutResponse,
  mailQRForm,
  mailQRResponce,
  profileError,
} from './ProfileTypes';
import WhatsAppLogo from '../../components/WhatsAppLogo';
import DeviceInfo from 'react-native-device-info';
import PopupCompo from '../../components/PopupCompo';
import CreditsCompo from './CreditsCompo';
const {width, height} = Dimensions.get('screen');

const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
export default function () {
  const {params} = useRoute<RouteProp<RootStackParamList, 'ProfileScreen'>>();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [credits, setCredits] = useState<null | number>(null);
  const [popupModal, setPopupModal] = useState(PopupModal);
  useEffect(() => {
    checkWhatsappStatus();
  }, []);
  const checkWhatsappStatus = () => {
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
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        setStatus(data.status);
        setCredits(data.instance.credits);
      } else {
        errorPopUp(StatusCode, null, 'BACK');
      }
      setLoading(false);
    },
    onError: error =>
      errorPopUp(error?.StatusCode, error?.error?.description, 'BACK'),
  });

  const appVersion = DeviceInfo.getVersion();
  const dissconnectWAPrompt = () => {
    Alert.alert(
      'Dissconect Whatsapp?',
      '',
      [
        {
          text: 'Yes',
          onPress: dissconnectWA,
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const dissconnectWA = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (token && id) {
      const formData = {
        mode: 'DISCONNECT_CONNECTION',
        token,
        id,
      };
      setLoading(true);
      disWAMutation.mutate(formData);
    }
  };

  const disWAMutation = useMutation<
    connectionResponce,
    profileError,
    connectionForm
  >({
    mutationFn: (formData: connectionForm) =>
      postData<connectionForm, connectionResponce>(Urls.WHATSAPP, formData),
    onSuccess: ({data, StatusCode}) => {
      StatusCode === 200
        ? setStatus(false)
        : errorPopUp(StatusCode, null, 'BACK');
      setLoading(false);
    },
    onError: error =>
      errorPopUp(error?.StatusCode, error?.error?.description, 'BACK'),
  });
  //
  const errorPopUp = (code: number, desc: string | null, buttTxt: string) => {
    setLoading(false);
    setPopupModal({
      state: true,
      title: `Oops! Something went wrong.${code ? ` [${code}]` : ''}`,
      disc: desc
        ? desc
        : "We couldn't complete your request, please try again!",
      buttOne: '',
      buttTwo: 'OKAY',
    });
  };
  const onDismiss = useCallback(() => {
    setPopupModal({...popupModal, state: false});
  }, [popupModal.state]);

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

      <HeaderCompo />
      {status && !loading && <WhatsAppLogo loading={loading} />}
      <ScrollView
        contentContainerStyle={{
          paddingTop: 50,
          paddingBottom: height * 0.04,
          paddingHorizontal: width * 0.05,
          gap: 40,
        }}>
        <ProfileCompo
          uri={params.pic}
          name={params.name}
          number={params.number}
          code={params.country_code}
        />
        <View style={{gap: 20}}>
          <CreditsCompo
            credits={
              credits
                ? credits.toString()
                : loading
                ? 'Loading'
                : 'Not Available'
            }
            loading={loading}
          />
          {/* {(!status || loading) && ( */}
          <ItemCompoContainer
            type={'whatsapp'}
            onSuccess={() => {
              checkWhatsappStatus();
            }}
            loadingMain={loading}
            title={
              loading
                ? 'Checking whatsapp connection'
                : status
                ? 'Disconnect whatsapp'
                : 'Connect your whatsApp'
            }
            onPressTab={status ? dissconnectWAPrompt : undefined}
          />
          {/* )} */}
          <ItemCompoContainer type={'logout'} title={'Logout'} />
        </View>
      </ScrollView>
      <Text
        style={{color: '#fff', position: 'absolute', bottom: 10, right: 10}}
        variant={'DetailRegular'}>
        v {appVersion}
      </Text>
      <PopupCompo
        isVisible={popupModal.state}
        onDismiss={onDismiss}
        title={popupModal.title}
        disc={popupModal.disc}
        buttOne={popupModal.buttOne}
        buttTwo={popupModal.buttTwo}
        buttOnePress={onDismiss}
        buttTwoPress={onDismiss}
      />
      {/* {loading && <LoadingCompo text={'Logging out'} />} */}
    </View>
  );
}
const ItemCompoContainer = ({
  type,
  title,
  onSuccess,
  loadingMain = false,
  onPressTab,
}: {
  type: string;
  title: string;
  onSuccess?: () => void;
  loadingMain?: boolean;
  onPressTab?: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const [shareQR, setShareQR] = useState(false);

  const logout = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        mode: 'LOGOUT',
        token: token,
      };
      setLoading(true);
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<logoutResponse, dashError, logoutForm>({
    mutationFn: (formData: logoutForm) =>
      postData<logoutForm, logoutResponse>(Urls.AUTH, formData),
    onSuccess: () => {
      setLoading(false);
      storage.clearAll();
    },
    onError: error => {
      setLoading(false);
      storage.clearAll();
    },
  });

  const onPress = () => {
    switch (type) {
      case 'logout':
        logout();
        break;

      case 'whatsapp':
        toggleModal();
        break;

      default:
        break;
    }
  };
  const toggleModal = () => setShareQR(pre => !pre);
  return (
    <>
      <ItemCompo
        type={type}
        title={title}
        onPress={loadingMain ? () => {} : onPressTab ? onPressTab : onPress}
        loading={loading || loadingMain}
      />
      {shareQR && (
        <ShareQRCompo
          shareQR={shareQR}
          toggleModal={toggleModal}
          onSuccess={() => {
            toggleModal();
            if (onSuccess) onSuccess();
          }}
        />
      )}
    </>
  );
};

const ItemCompo = ({
  type,
  title,
  loading,
  onPress,
}: {
  type: string;
  title: string;
  loading: boolean;
  onPress: () => void;
}) => {
  const icons = () => {
    switch (type) {
      case 'logout':
        return <LogoutSVG width={20} height={20} />;

      case 'whatsapp':
        return <WASVG width={20} height={20} fill={'#fff'} />;

      case 'mail':
        return <MailSVG width={20} height={20} fill={'#fff'} />;

      case 'connect':
        return <ConnectSVG width={20} height={20} fill={'#fff'} />;

      default:
        return '';
    }
  };

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#C5B1C33D',
        borderRadius: 5,
        paddingHorizontal: 12,
        paddingVertical: 18,
        gap: 12,
      }}
      disabled={loading}
      onPress={onPress}>
      {loading ? <ActivityIndicator color={'#fff'} /> : icons()}
      <Text
        variant={'BodyRegular'}
        style={{
          color: '#fff',
        }}>
        {title}
      </Text>
    </Pressable>
  );
};

const ProfileCompo = memo(
  ({
    uri,
    name,
    number,
    code,
  }: {
    uri: string;
    name: string;
    number: string;
    code: string;
  }) => {
    return (
      <View
        style={{
          alignItems: 'center',
          gap: 20,
        }}>
        <View>
          <Image
            source={{uri}}
            style={{
              width: width * 0.25,
              height: width * 0.25,
              borderRadius: width * 0.25,
            }}
          />
          <Pressable
            onPress={() => {
              ToastAndroid.showWithGravity(
                `Coming Soon!`,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
            }}
            style={{
              backgroundColor: '#2D2D2D',
              borderRadius: 100,
              position: 'absolute',
              bottom: -13,
              alignSelf: 'center',
              padding: 6,
            }}>
            <EditSVG width={20} height={20} fill={'#fff'} />
          </Pressable>
        </View>
        <View
          style={{
            gap: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <Text variant={'TitleOne'} style={{color: '#fff'}}>
              {name}
            </Text>
            <Pressable
              onPress={() => {
                ToastAndroid.showWithGravity(
                  `Coming Soon!`,
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
              }}>
              <EditSVG width={20} height={20} fill={'#fff'} />
            </Pressable>
          </View>
          <Text
            variant={'BodyRegular'}
            style={{color: '#fff', alignSelf: 'center', textAlign: 'center'}}>
            +{code} {number}
          </Text>
        </View>
      </View>
    );
  },
);

const ShareQRCompo = ({
  shareQR,
  toggleModal,
  onSuccess,
}: {
  shareQR: boolean;
  toggleModal: () => void;
  onSuccess: () => void;
}) => {
  const [showEmail, setShowEmail] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (token && id) {
      const formData = {
        mode: 'GET_QR_MSG',
        token,
        id,
      };
      setLoading(true);
      mutation.mutate(formData);
    }
  }, []);

  const mutation = useMutation<WAmessageResponse, profileError, connectionForm>(
    {
      mutationFn: (formData: connectionForm) =>
        postData<connectionForm, WAmessageResponse>(Urls.WHATSAPP, formData),
      onSuccess: ({data}) => {
        setMessage(data.msg_tpl);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
    },
  );

  const shareWA = () => {
    let url = `whatsapp://send?text=${message}`;

    Linking.openURL(url)
      .then(data => {
        // console.log("WhatsApp Opened")
      })
      .catch(() => {
        alert('Make sure Whatsapp installed on your device');
      });
  };
  return (
    <Modal isVisible={shareQR} collapsable={true} onDismiss={toggleModal}>
      <View
        style={{
          backgroundColor: '#75486F',
          borderRadius: 20,
          paddingVertical: 40,
          paddingHorizontal: 20,
          gap: 30,
        }}>
        <View
          style={{
            alignItems: 'center',
            gap: 30,
          }}>
          <Text
            variant={'SubTitleOne'}
            style={{
              color: '#fff',
            }}>
            Share QR link
          </Text>

          <Image
            source={require('../../assets/images/QRSCAN.png')}
            style={{
              width: width * 0.6,
              height: width * 0.6,
            }}
          />
        </View>
        {showEmail ? (
          <SendEmail />
        ) : (
          <View style={{gap: 20}}>
            <ItemCompo
              type={'whatsapp'}
              title={'Share on WhatsApp'}
              onPress={shareWA}
              loading={false}
            />
            <ItemCompo
              type={'mail'}
              title={'Share on email'}
              onPress={() => {
                setShowEmail(pre => !pre);
              }}
              loading={false}
            />
            <CheckWhatsappConnection onSuccess={onSuccess} />
          </View>
        )}
        <Pressable
          style={{
            backgroundColor: '#fff',
            borderRadius: 100,
            padding: 2,
            position: 'absolute',
            top: 14,
            right: 14,
          }}
          onPress={toggleModal}>
          <CloseSVG width={32} height={32} fill={'#75486F'} />
        </Pressable>
      </View>
    </Modal>
  );
};
const CheckWhatsappConnection = ({onSuccess}: {onSuccess: () => void}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    status: false,
    interval: 0,
  });
  const [polling, setPolling] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const checkWhatsappStatus = () => {
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
    onSuccess: ({data: {status, interval}}) => {
      setData({status, interval});
      setCountdown(interval); // Initialize the countdown with the interval value
      setLoading(false);

      // Start polling if the interval is greater than 0
      if (!status) {
        setPolling(true);
      } else {
        onSuccess();
        setPolling(false);
      }
    },
    onError: () => {
      setLoading(false);
      setPolling(false);
    },
  });

  // Handle polling logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (polling) {
      intervalId = setInterval(() => {
        checkWhatsappStatus(); // Trigger the API call at the specified interval
      }, data.interval * 1000);

      // Start countdown timer
      let countdownTimer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : data.interval));
      }, 1000);

      return () => {
        clearInterval(intervalId);
        clearInterval(countdownTimer);
      };
    }

    // Cleanup when polling stops
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [polling, data.interval]);

  return (
    <View style={{gap: 4}}>
      <ItemCompo
        type={'connect'}
        title={`Check Whatsapp connection`}
        onPress={data.interval === 0 ? checkWhatsappStatus : () => {}}
        loading={loading || data.interval > 0}
      />
      {(loading || data.interval > 0) && (
        <Text style={{color: '#f1f1f1'}} variant={'DetailRegular'}>
          Whatsapp not linked. Rechecking...{' '}
          {countdown > 0 && !data.status ? `in ${countdown}s` : ''}...
        </Text>
      )}
    </View>
  );
};
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const SendEmail = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const sendmail = () => {
    if (validateEmail(email)) {
      const token = storage.getString('user.token');
      const id = storage.getString('user.id');
      if (
        token !== null &&
        token !== undefined &&
        id !== null &&
        id !== undefined
      ) {
        const formData = {
          mode: 'SEND_QR_EMAIL',
          token,
          id,
          email,
        };
        setError('');
        setLoading(true);
        mutation.mutate(formData);
      }
    } else {
      setError('Please enter correct email address!');
    }
  };

  const mutation = useMutation<mailQRResponce, dashError, mailQRForm>({
    mutationFn: (formData: mailQRForm) =>
      postData<mailQRForm, mailQRResponce>(Urls.WHATSAPP, formData),
    onSuccess: () => {
      setLoading(false);
      setSuccess(true);
    },
    onError: error => {
      setLoading(false);
      if (success) setSuccess(false);
    },
  });

  return (
    <View style={{gap: 30}}>
      <View style={{gap: 12}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}>
          <MailSVG width={16} />
          <Text variant={'BodyRegular'} style={{color: '#fff'}}>
            Share QR on your email
          </Text>
        </View>
        <TextInput
          value={email}
          onChangeText={setEmail}
          textInputStyle={{
            fontFamily: 'PoppinsBold',
            fontWeight: '600',
            letterSpacing: 0,
            fontSize: 18,
            lineHeight: 27,
            color: '#fff',
          }}
          textInputProps={{
            placeholder: 'Eg: mail@email.com',
          }}
        />
        <Text
          variant={'BodyRegular'}
          style={{color: 'red', position: 'absolute', bottom: -24}}>
          {error}
        </Text>
      </View>
      {success ? (
        <View>
          <Text
            variant={'SubTitleTwo'}
            style={{color: '#fff', alignSelf: 'center'}}>
            Link successfully shared on email!
          </Text>
        </View>
      ) : (
        <Button
          lable="CONTINUE"
          onPress={loading ? () => {} : sendmail}
          textStyles={{color: '#fff'}}
          buttonStyles={{backgroundColor: '#2D2D2D', width: '100%'}}
          loading={loading}
        />
      )}
    </View>
  );
};
