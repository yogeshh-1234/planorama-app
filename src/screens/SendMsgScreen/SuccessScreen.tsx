import React, {memo, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {BGline} from '../../assets/SVG/VectorSVG';
import Text from '../../components/Text';
import Button from '../../components/Button';
import {EyeSVG} from '../../assets/SVG/IconsSVG';
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {MainStackNavigation, RootStackParamList} from '../../navigation';

const {width, height} = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

export default function () {
  const {params} = useRoute<RouteProp<RootStackParamList, 'SuccessScreen'>>();
  const navigation = useNavigation<MainStackNavigation>();
  const TextBlock = () => {
    switch (params.type) {
      case 'invite':
        return (
          <View style={styles.textBlock}>
            <Text variant={'TitleTwo'} style={styles.whiteText}>
              Invite sent
            </Text>
            <Text variant={'BodyRegular'} style={styles.whiteText}>
              {params.textOne}
            </Text>
            <Text variant={'SubTitleOne'} style={styles.yellowText}>
              {params.textTwo}
            </Text>
          </View>
        );

      case 'rsvp':
        return (
          <View style={styles.textBlock}>
            <Text variant={'TitleTwo'} style={styles.whiteText}>
              RSVP sent successfully
            </Text>
            <Text variant={'BodyRegular'} style={styles.whiteText}>
              {params.textOne}
            </Text>
            <Text variant={'SubTitleOne'} style={styles.yellowText}>
              {params.textTwo}
            </Text>
          </View>
        );

      default:
        return <View />;
    }
  };

  const onViewEvent = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {name: 'HomeScreen'},
          {
            name: 'EventDetails',
            params: {id: params.eventID},
          },
        ],
      }),
    );
  };

  const onDash = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'HomeScreen'}],
      }),
    );
  };
  const goBack = () => {
    navigation.goBack();
  };

  const ButtonsBlock = () => {
    switch (params.type) {
      case 'invite':
        return (
          <View>
            <Button
              lable="VIEW EVENT"
              onPress={onViewEvent}
              buttonStyles={{
                backgroundColor: '#fff',
              }}
              textStyles={{
                color: '#2D2D2D',
              }}
              icon={() => <EyeSVG width={26} height={26} />}
            />
            <Button
              lable="GO TO DASHBOARD"
              onPress={onDash}
              buttonStyles={{
                backgroundColor: 'transparent',
              }}
              textStyles={{
                color: '#fff',
              }}
              variant="SubTitleOne"
            />
          </View>
        );

      case 'rsvp':
        return (
          <View>
            <Button
              lable="GO TO DASHBOARD"
              onPress={goBack}
              buttonStyles={{
                backgroundColor: '#fff',
              }}
              textStyles={{
                color: '#2D2D2D',
              }}
              // icon={() => <EyeSVG width={26} height={26} />}
            />
            {/* <Button
              lable="GO TO DASHBOARD"
              onPress={onDash}
              buttonStyles={{
                backgroundColor: 'transparent',
              }}
              textStyles={{
                color: '#fff',
              }}
              variant="SubTitleOne"
            /> */}
          </View>
        );

      default:
        return <View />;
    }
  };

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
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-around',
            flex: 1,
          }}>
          <Image
            source={require('../../assets/images/Celebration.png')}
            style={{
              width: width * 0.9,
              height: height * 0.4,
            }}
            resizeMode="contain"
          />

          <TextBlock />
          <ButtonsBlock />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: height * 0.02,
  },
  whiteText: {
    color: '#fff',
    textAlign: 'center',
  },
  yellowText: {
    color: '#F9BC52',
    textAlign: 'center',
  },
});
