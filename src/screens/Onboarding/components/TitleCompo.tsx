import React from 'react';
import {View} from 'react-native';
import Text from '../../../components/Text';
import {FadeIn, FadeInUp, FadeOut} from 'react-native-reanimated';

export default function () {
  return (
    <>
      <Text
        entering={FadeIn}
        exiting={FadeOut}
        variant={'Heading'}
        style={{color: '#fff'}}>
        Sign up or sign in
      </Text>
      <Text
        entering={FadeIn.delay(200)}
        exiting={FadeOut}
        variant={'BodyRegular'}
        style={{color: '#fff'}}>
        Enter your WhatsApp number to proceed
      </Text>
    </>
  );
}
