import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, Keyboard, Pressable, View} from 'react-native';
import Text from '../../components/Text';
import Button from '../../components/Button';
import {OtpInput} from 'react-native-otp-entry';
import TitleCompo from './components/TitleCompo';
import CustomCheckBox from '../../components/CheckBox';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {AuthSuccess, ErrorFormat, SendOTPform} from './authType';
import {postData} from '../../api';
import Urls from '../../api/urls';
import PopupCompo from '../../components/PopupCompo';
import Animated, {FadeIn, FadeInDown, FadeInUp, FadeOut} from 'react-native-reanimated';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
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
    let country_code = '';
    let tempCode = storage.getString('country.code');
    if (tempCode !== null && tempCode !== undefined) {
      country_code = tempCode;
    }
    const formData = {
      mode: isNewUser ? 'VERIFY' : 'LOGIN',
      mobile: mobile,
      otp: otpVal,
      country_code,
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
          storage.set('user.id', data.data.id);
          storage.set('user.token', data.data.token);
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
      <Animated.View
        sharedTransitionTag="authTitle"
        style={{
          gap: height * 0.02,
        }}>
        <TitleCompo />
      </Animated.View>
      <Text
        variant={'TitleOne'}
        style={{color: '#fff'}}
        entering={FadeInUp}
        exiting={FadeOut}>
        {num}
      </Text>
      <View style={{gap: height * 0.03}}>
        <Animated.View entering={FadeInUp.delay(300)} exiting={FadeOut}>
          <OtpInput
            disabled={loading}
            numberOfDigits={6}
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
        </Animated.View>
        <Text
          entering={FadeInUp.delay(400)}
          exiting={FadeOut}
          variant={'DetailRegular'}
          style={{color: '#fff', textAlign: 'center'}}>
          Did not receive OTP?{' '}
          <Text variant={'DetailBold'} style={{color: '#fff'}}>
            Resend
          </Text>
        </Text>
        <AnimatedPressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          entering={FadeInUp.delay(500)}
          exiting={FadeOut}
          onPress={() => setCheck(pre => !pre)}>
          <CustomCheckBox
            checked={check}
            checkMarkColor={'#fff'}
            checkedBorderColor={'#fff'}
            unCheckedBorderColor={'#fff'}
            checkedBackgroundColor={'#fff'}
            unCheckedBackgroundColor={'#fff'}
            height={30}
            width={30}
            SvgStyles={{
              marginRight: 10,
            }}
            index={1}
            duration={300}
          />
          <Text
            variant={'DetailRegular'}
            style={{color: '#fff', textDecorationLine: 'underline'}}>
            I agree to T&C Lorem ipsum dolor sit amet, sdasd consectetur
            adipiscing elit, sed do
          </Text>
        </AnimatedPressable>
        <Animated.View entering={FadeIn.delay(600)} exiting={FadeOut}>
          <Button
            lable="CONTINUE"
            onPress={submitCode}
            disabled={otpVal.length !== 6 || !check}
          />
        </Animated.View>
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
