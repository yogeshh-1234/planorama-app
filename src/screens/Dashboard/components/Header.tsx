import React from 'react';
import {Dimensions, Image, Pressable, StyleSheet, View} from 'react-native';
import {NotiSVG, UsersSVG} from '../../../assets/SVG/IconsSVG';

const {width, height} = Dimensions.get('screen');
const PIC_H = 50;
export default function () {
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
        }}>
        <Image
          source={require('../../../assets/images/Logo_W.png')}
          style={{
            height: PIC_H,
            width: (PIC_H * 178) / 58,
          }}
          resizeMode="contain"
        />
      </View>
      <Pressable
        style={{
          padding: 10,
        }}>
        <UsersSVG width={30} height={30} />
      </Pressable>

      <Pressable
        style={{
          padding: 10,
        }}>
        <NotiSVG width={30} height={30} />
      </Pressable>
      <Pressable
        style={{
          height: 40,
          width: 40,
          borderRadius: 100,
          backgroundColor: '#fff',
        }}></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:8,
    gap:8,
    paddingRight:16
  },
});
