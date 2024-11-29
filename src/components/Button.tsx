import {MotiView, useAnimationState} from 'moti';
import React, {memo} from 'react';
import {Dimensions, Pressable, StyleSheet} from 'react-native';
import Text from './Text';
import {StyleProps} from 'react-native-reanimated';
import {ActivityIndicator} from 'react-native-paper';

const {width} = Dimensions.get('screen');

export default memo(
  ({
    lable,
    small = false,
    loading = false,
    buttonStyles,
    buttWidth = width * 0.9,
    disabled = false,
    onPress,
  }: {
    lable: string;
    small?: boolean;
    loading?: boolean;
    buttonStyles?: StyleProps;
    buttWidth?: number;
    disabled?: boolean;
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
        disabled={loading || disabled}
        style={{}}>
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
          <Text
            variant={'SubTitleOne'}
            style={[
              styles.buttTwoTxt,
              {
                color: disabled ? '#dcdcdc' : '#fff',
              },
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
