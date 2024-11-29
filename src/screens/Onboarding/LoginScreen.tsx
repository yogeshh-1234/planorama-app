import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StatusBar,
  View,
} from 'react-native';
import Background from '../../components/Background';
import BackgroundSVG from '../../assets/SVG/BackgroundSVG';
import {BGline, IntroSVG} from '../../assets/SVG/VectorSVG';
import Text from '../../components/Text';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import TitleCompo from './components/TitleCompo';
import {CountryPicker} from 'react-native-country-codes-picker';
import {DownSVG} from '../../assets/SVG/IconsSVG';
import PopupCompo from '../../components/PopupCompo';
import Loading from '../../components/Loading';
import {useMutation} from '@tanstack/react-query';
import {CheckNumResponse, ErrorFormat, SendOTPform} from './authType';
import {postData} from '../../api';
import Urls from '../../api/urls';
import {storage} from '../../functions/storage';

const {width, height} = Dimensions.get('screen');
const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
export default function ({onPress}: {onPress: () => void}) {
  const [num, setNum] = useState('');
  const [show, setShow] = useState(false);
  const [popupModal, setPopupModal] = useState(PopupModal);

  const [codeData, setCodeData] = useState({
    code: 'IN',
    dial_code: '+91',
    flag: '🇮🇳',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    storage.delete('new.user');
    storage.delete('phone.number');
    storage.delete('display.number');
  }, []);

  const checkNum = () => {
    Keyboard.dismiss();

    setLoading(true);
    const mobile = `${codeData.dial_code.replace(/\+/g, '')}${num}`;
    mutation.mutate({
      mode: 'SEND_OTP',
      mobile,
      // 917798246842
    });
  };

  const mutation = useMutation<CheckNumResponse, ErrorFormat, SendOTPform>({
    mutationFn: (credentials: SendOTPform) =>
      postData<SendOTPform, CheckNumResponse>(Urls.AUTH, credentials),
    onSuccess: data => {
      if (data.StatusCode === 200) {
        storage.set(
          'phone.number',
          `${codeData.dial_code.replace(/\+/g, '')}${num}`,
        );
        storage.set('display.number', `${codeData.dial_code} ${num}`);
        storage.set('new.user', data.data.newuser);

        onPress();
      } else {
        setPopupModal({
          state: true,
          title: `Oops! Something went wrong.${
            data.StatusCode ? ` [${data.StatusCode}]` : ''
          }`,
          disc: "We couldn't complete your request, please try again!",
          buttOne: '',
          buttTwo: 'OKAY',
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
        buttOne: '',
        buttTwo: 'OKAY',
      });
    },
  });

  const onDismiss = useCallback(
    () => setPopupModal({...popupModal, state: false}),
    [],
  );

  // const buttOnePress = () => {
  //   onDismiss();
  // };
  // const buttTwoPress = () => {
  //   onDismiss();
  //   onPressFn();
  // };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: width * 0.05,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          gap: height * 0.02,
        }}>
        <View />
        <TitleCompo />
      </View>
      <View style={{gap: height * 0.02}}>
        <Animated.View
          entering={FadeIn.delay(400)}
          exiting={FadeOut}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable
            style={{
              paddingHorizontal: 14,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
            onPress={() => setShow(pre => !pre)}>
            <Text variant={'SubTitleTwo'} style={{color: '#fff'}}>
              {codeData.flag} {codeData.dial_code}
            </Text>
            <DownSVG width={20} height={20} />
          </Pressable>
          <View
            style={{
              flex: 1,
            }}>
            <TextInput
              value={num}
              onChangeText={setNum}
              textInputProps={{
                maxLength: 15,
                keyboardType: 'number-pad',
                returnKeyType: 'send',
                returnKeyLabel: 'GO!',
                dataDetectorTypes: 'phoneNumber',
                cursorColor: '#fff',
                selectionColor:'#2D2D2D'
              }}
              textInputStyle={{
                letterSpacing: 3,
                paddingHorizontal: 12,
              }}
            />
          </View>
        </Animated.View>
        {num.length >= 7 && (
          <Text
            entering={FadeInUp}
            variant={'DetailRegular'}
            style={{color: '#fff'}}>
            OTP will be sent via WhatsApp
          </Text>
        )}
      </View>
      {num.length >= 7 && (
        <Animated.View entering={FadeIn.delay(300)} exiting={FadeOut}>
          <Button lable="SEND OTP" onPress={checkNum} loading={loading} />
        </Animated.View>
      )}
      <View />
      <View />
      <View />
      <CountryPicker
        show={show}
        lang="en"
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={item => {
          setCodeData({
            code: item.code,
            dial_code: item.dial_code,
            flag: item.flag,
          });
          setShow(false);
        }}
        onRequestClose={() => {
          setShow(false);
        }}
        onBackdropPress={() => {
          setShow(false);
        }}
        style={{
          // Styles for whole modal [View]
          modal: {
            height: height * 0.6,
            backgroundColor: '#75486F',
          },
          // Styles for modal backdrop [View]
          backdrop: {},
          // Styles for bottom input line [View]
          line: {
            backgroundColor: '#C5B1C33D',
          },
          // Styles for list of countries [FlatList]
          itemsList: {
            // #C5B1C33D
            // backgroundColor:'red'
          },
          // Styles for input [TextInput]
          textInput: {
            //   height: 80,
            //   borderRadius: 0,
            color: '#fff',
            backgroundColor: '#C5B1C33D',
          },
          // Styles for country button [TouchableOpacity]
          countryButtonStyles: {
            //   height: 80
            backgroundColor: '#C5B1C33D',
          },
          // Styles for search message [Text]
          searchMessageText: {
            color: '#fff',
          },
          // Styles for search message container [View]
          countryMessageContainer: {},
          // Flag styles [Text]
          flag: {},
          // Dial code styles [Text]
          dialCode: {
            color: '#fff',
          },
          // Country name styles [Text]
          countryName: {
            color: '#fff',
          },
        }}
        inputPlaceholderTextColor={'#ffffff80'}
      />

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
    </View>
  );
}
