import React from 'react';
import {Dimensions, Image, StatusBar, View} from 'react-native';
import Background from '../../components/Background';
import BackgroundSVG from '../../assets/SVG/BackgroundSVG';
import {BGline, IntroSVG} from '../../assets/SVG/VectorSVG';
import Text from '../../components/Text';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../navigation';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

const {width, height} = Dimensions.get('screen');

const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
export default function () {
  const navigation = useNavigation<MainStackNavigation>();

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
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <BackgroundSVG width={'100%'} height={'100%'} />
      </Animated.View>
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
        <Animated.View
          style={{
            // borderWidth: 1,
            marginTop: height * 0.12,
            alignItems: 'center',
          }}>
          <Animated.Image
            entering={FadeIn}
            exiting={FadeOut}
            source={require('../../assets/images/Logo_W.png')}
            style={{
              width: width,
              height: height * 0.075,
            }}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={{
            // borderWidth: 1,
            alignItems: 'center',
          }}>
          <IntroSVG
            width={width * 0.8}
            height={height * 0.4}
            style={{
              transform: [{scale: 1.2}],
            }}
          />
        </Animated.View>
        <View
          style={{
            alignItems: 'center',
            // borderWidth: 1,
            flex: 1,
            justifyContent: 'space-evenly',
          }}>
          <Text
            variant={'TitleOne'}
            style={{color: '#fff', textAlign: 'center'}}>
            <Text
              variant={'TitleOne'}
              style={{color: '#F9BC52', textAlign: 'center'}}>
              Intelligent
            </Text>{' '}
            RSVP
          </Text>
          <Button
            lable="Get Started"
            onPress={() => navigation.navigate('AuthScreen')}
          />
          <View />
        </View>
      </View>
    </View>
  );
}
