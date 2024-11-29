import {MotiView} from 'moti';
import React, {memo} from 'react';
import {Dimensions, Image, View} from 'react-native';
import {Portal} from 'react-native-paper';

const {width, height} = Dimensions.get('screen');

export default memo(() => {
  return (
    <Portal>
      <View
        style={{
          // width: width,
          // height: height,
          // borderWidth: 1,
          // borderColor: 'red',
          position: 'absolute',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}>
        <MotiView
          style={{
            // backgroundColor:'#C5B1C33D',
            // backgroundColor: '#3A253780',
            borderRadius: 12,
            // borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          from={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 800,
            type: 'timing',
            loop: true,
          }}>
          {/* <LottieView
          source={require('../../assets/lottie/loading.lottie')}
          style={{width: width * 0.5, height: width * 0.5}}
          autoPlay={true}
          loop={true}
        /> */}
          <Image
            source={require('../assets/images/Logo_Y.png')}
            style={{
              width: width * 0.2,
              height: width * 0.2,
              position: 'absolute',
            }}
          />
        </MotiView>
      </View>
    </Portal>
  );
});
