import LottieView from 'lottie-react-native';
import React from 'react';
import {Dimensions, View} from 'react-native';
import Modal from 'react-native-modal';
import Text from './Text';

const {width, height} = Dimensions.get('screen');
export default function ({text}: {text: string}) {
  return (
    <Modal
      isVisible={true}
      style={{
        alignItems: 'center',
      }}
      animationIn={'zoomIn'}
      animationOut={'fadeOutDown'}
      // onDismiss={onDismiss}
      // onBackdropPress={onDismiss}
      // onBackButtonPress={onDismiss}
    >
      <View
        style={{
          // backgroundColor: '#ffffff80',
          alignItems: 'center',
          justifyContent: 'center',
          width: width * 0.8,
          height: 100,
          borderRadius: 10,
        }}>
        <LottieView
          source={require('../assets/lottie/loading.lottie')}
          style={{width: '100%', height: '100%'}}
          autoPlay
          loop
        />
        <Text
          variant={'BodyRegular'}
          style={{color: '#fff', alignSelf: 'center', textAlign: 'center'}}>
          {text}
        </Text>
      </View>
    </Modal>
  );
}
