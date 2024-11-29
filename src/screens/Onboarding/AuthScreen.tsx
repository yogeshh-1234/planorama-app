import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, Image, StatusBar, View} from 'react-native';
import Background from '../../components/Background';
import BackgroundSVG from '../../assets/SVG/BackgroundSVG';
import {BGline, IntroSVG} from '../../assets/SVG/VectorSVG';
import Text from '../../components/Text';
import Button from '../../components/Button';
import LoginScreen from './LoginScreen';
import OTPScreen from './OTPScreen';
import RegisterScreen from './RegisterScreen';
import {Portal} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import Loading from '../../components/Loading';

const {width, height} = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

type screenType = 'login' | 'otp' | 'register';
export default function () {
  const [screenState, setScreenState] = useState<screenType>('login');

  useEffect(() => {}, []);

  const openOTP = useCallback(() => {
    setScreenState('otp');
  }, []);

  const openReg = useCallback(() => {
    setScreenState('register');
  }, []);
  
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
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            // borderWidth: 1,
            marginTop: height * 0.01,
            marginBottom: height * 0.05,
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/Logo_W.png')}
            style={{
              width: width,
              height: height * 0.06,
            }}
            resizeMode="contain"
          />
        </View>
        <View style={{flex: 1}}>
          {screenState === 'register' && <RegisterScreen />}
          {screenState === 'login' && <LoginScreen onPress={openOTP} />}
          {screenState === 'otp' && <OTPScreen onPress={openReg} />}
        </View>
      </View>
      {/* <Loading /> */}
    </View>
  );
}
