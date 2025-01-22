import React from 'react';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import BackgroundSVG from '../../assets/SVG/BackgroundSVG';
import {BGline, IntroSVG} from '../../assets/SVG/VectorSVG';
import Text from '../../components/Text';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../navigation';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

const {width, height} = Dimensions.get('screen');

const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

const LOGO = require('../../assets/images/Logo_W.png')
export default function () {
  const navigation = useNavigation<MainStackNavigation>();
  const onPress = () => navigation.navigate('AuthScreen');
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent
        barStyle={'light-content'}
      />
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.bgStyles}>
        <BackgroundSVG width={'100%'} height={'100%'} />
      </Animated.View>
      <BGline width={'100%'} height={height * 0.1} style={styles.bgLineSty} />
      <View style={styles.flex}>
        <Animated.View style={styles.logoBox}>
          <Animated.Image
            entering={FadeIn}
            exiting={FadeOut}
            source={LOGO}
            style={styles.logoImg}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View
          entering={FadeIn.delay(250)}
          exiting={FadeOut}
          style={styles.svgView}>
          <IntroSVG
            width={width * 0.8}
            height={height * 0.4}
            style={styles.svgImg}
          />
        </Animated.View>
        <View style={styles.contentView}>
          <Text variant={'TitleOne'} style={styles.textSty}>
            <Text variant={'TitleOne'} style={styles.textStyMain}>
              Intelligent
            </Text>{' '}
            RSVP
          </Text>
          <Button lable="Get Started" onPress={onPress} />
          <View />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#75486F',
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  bgStyles: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  bgLineSty: {
    position: 'absolute',
    top: Top_Height + height * 0.02,
    left: 0,
    right: 0,
  },
  flex: {
    flex: 1,
  },
  logoBox: {
    marginTop: height * 0.12,
    alignItems: 'center',
  },
  logoImg: {
    width: width,
    height: height * 0.075,
  },
  svgView: {
    alignItems: 'center',
  },
  svgImg: {
    transform: [{scale: 1.2}],
  },
  contentView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  textSty: {
    color: '#fff',
    textAlign: 'center',
  },
  textStyMain: {
    color: '#F9BC52',
    textAlign: 'center',
  },
});
