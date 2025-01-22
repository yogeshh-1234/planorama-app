import {MotiView, useAnimationState} from 'moti';
import React, {Component, FunctionComponent, memo} from 'react';
import {Dimensions, Pressable, StyleSheet, TextStyle} from 'react-native';
import Text from './Text';
import {StyleProps} from 'react-native-reanimated';
import {ActivityIndicator} from 'react-native-paper';
import {CustomVariantProp} from '../config/fonts';

const {width} = Dimensions.get('screen');

export default memo(
  ({
    lable,
    small = false,
    loading = false,
    buttonStyles,
    textStyles,
    buttWidth = width * 0.9,
    disabled = false,
    variant = 'SubTitleOne',
    icon=()=><></>,
    onPress,
  }: {
    lable: string;
    small?: boolean;
    loading?: boolean;
    buttonStyles?: StyleProps;
    textStyles?: TextStyle;
    buttWidth?: number;
    disabled?: boolean;
    variant?: CustomVariantProp;
    icon?: () => JSX.Element;
    onPress: () => void;
  }) => {
    const buttOneState = useAnimationState({
      from: {
        scale: 1,
      },
      to: {
        scale: 1,
      },
      pressd: {scale: 0.97},
    });
    const buttTwoState = useAnimationState({
      from: {
        scale: 1,
      },
      to: {
        scale: 1,
      },
      pressd: {scale: 0.97},
    });
    return (
      <Pressable
        onPressIn={() => buttTwoState.transitionTo('pressd')}
        onPressOut={() => buttTwoState.transitionTo('to')}
        onPress={disabled ? null : onPress}
        disabled={loading || disabled}>
        <MotiView
          style={[
            styles.buttTwo,
            {
              paddingVertical: small ? 14 : 20,
              width: buttWidth,
              backgroundColor: disabled ? '#4f4f4f' : '#2d2d2d',
            },
            buttonStyles,
          ]}
          state={buttTwoState}>
            
          {loading && <ActivityIndicator color="#75486F" />}
          {icon()}
          <Text
            variant={variant}
            style={[
              styles.buttTwoTxt,
              {
                color: disabled ? '#dcdcdc' : '#fff',
              },
              textStyles,
            ]}>
            {lable}
          </Text>
        </MotiView>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  buttTwo: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttTwoTxt: {
    textAlign: 'center',
  },
});
