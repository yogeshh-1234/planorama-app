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
import Animated from 'react-native-reanimated';
import {OtpInput} from 'react-native-otp-entry';
import TitleCompo from './components/TitleCompo';
import {Checkbox} from 'react-native-paper';
import CustomCheckBox from '../../components/CheckBox';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {
  AuthSuccess,
  ErrorFormat,
  SendOTPform,
  VerifyOTPResponse,
} from './authType';
import {postData} from '../../api';
import Urls from '../../api/urls';
import PopupCompo from '../../components/PopupCompo';

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
  const [check, setCheck] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [loading, setLoading] = useState(false);

  const [popupModal, setPopupModal] = useState(PopupModal);
  useEffect(() => {
    const tempNum = storage.getString('display.number');
    if (tempNum !== null && tempNum !== undefined) {
      setNum(tempNum);
    }
  }, []);

  const submitCode = () => {
    Keyboard.dismiss();
    //
    let isNewUser = false;
    const tempUser = storage.getBoolean('new.user');
    if (tempUser !== null && tempUser !== undefined) {
      isNewUser = tempUser;
    } else {
      isNewUser = false;
    }
    //
    let mobile = '';
    const tempNum = storage.getString('phone.number');
    if (tempNum !== null && tempNum !== undefined) {
      mobile = tempNum;
    }
    //

    const formData = {
      mode: isNewUser ? 'VERIFY' : 'LOGIN',
      mobile: mobile,
      otp: otpVal,
    };
    setLoading(true);

    mutation.mutate(formData);
  };
  const mutation = useMutation<AuthSuccess, ErrorFormat, SendOTPform>({
    mutationFn: (credentials: SendOTPform) =>
      postData<SendOTPform, AuthSuccess>(Urls.AUTH, credentials),
    onSuccess: data => {
      if (data.StatusCode === 200) {
        const tempUser = storage.getBoolean('new.user');
        if (tempUser !== null && tempUser !== undefined && tempUser) {
          onPress();
        } else {
          storage.set('user.token', data.data.token);
          storage.set('user.id', data.data.id);
        }
        //  navigate to register
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
        <TitleCompo />
      </View>
      <Text variant={'TitleOne'} style={{color: '#fff'}}>
        {/* +91 9876543210 */}
        {num}
      </Text>
      <View style={{gap: height * 0.03}}>
        <View>
          <OtpInput
            numberOfDigits={6}
            focusColor="green"
            focusStickBlinkingDuration={500}
            onTextChange={text => setOtpVal(text)}
            onFilled={text => setOtpVal(text)}
            textInputProps={{
              accessibilityLabel: 'One-Time Password',
            }}
            theme={{
              containerStyle: {
                gap: 10,
              },
              pinCodeContainerStyle: {
                backgroundColor: '#C5B1C366',
                borderColor: '#fff',
                borderWidth: 1,
                flex: 1,
              },
              pinCodeTextStyle: {
                fontFamily: 'PoppinsBold',
                fontWeight: '700',
                letterSpacing: 0,
                fontSize: 25,
                lineHeight: 37.5,
                color: '#fff',
              },
              focusStickStyle: {
                backgroundColor: '#fff',
              },
              focusedPinCodeContainerStyle: {
                backgroundColor: '#C5B1C366',
                borderColor: '#fff',
                borderWidth: 1,
              },
            }}
          />
        </View>
        <Text
          variant={'DetailRegular'}
          style={{color: '#fff', textAlign: 'center'}}>
          Did not receive OTP?{' '}
          <Text variant={'DetailBold'} style={{color: '#fff'}}>
            Resend
          </Text>
        </Text>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => setCheck(pre => !pre)}>
          <CustomCheckBox
            duration={300}
            width={30}
            height={30}
            checked={check}
            checkMarkColor={'#fff'}
            checkedBorderColor={'#fff'}
            unCheckedBorderColor={'#fff'}
            checkedBackgroundColor={'#fff'}
            unCheckedBackgroundColor={'#fff'}
            SvgStyles={{
              marginRight: 10,
            }}
          />
          <Text variant={'DetailRegular'} style={{color: '#fff'}}>
            I agree to T&C Lorem ipsum dolor sit amet, sdasd consectetur
            adipiscing elit, sed do
          </Text>
        </Pressable>
        <Button
          lable="CONTINUE"
          onPress={submitCode}
          disabled={otpVal.length !== 6 || !check}
        />
      </View>
      <View />
      <View />
      <View />
      <View />

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
