import React from 'react';
import {Pressable, SafeAreaView, View, StyleSheet, Button} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const BallON = '#2D2D2D';
const BallOFF = '#fff';

const switchWidth = 50;
const switchheight = 25;
const switchpadding = 3;
export default ({
  value,
  onPress,
  style,
  duration = 400,
  trackColors = {on: '#FFFFFF', off: '#75486F'},
}) => {
  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      value.value,
      [0, 1],
      [trackColors.off, trackColors.on],
    );
    const colorValue = withTiming(color, {duration});

    return {
      backgroundColor: colorValue,
      borderRadius: height.value / 2,
    };
  });
  //
  const ballStyle = useAnimatedStyle(() => {
    const color = interpolateColor(value.value, [0, 1], [BallOFF, BallON]);
    const colorValue = withTiming(color, {duration});

    return {
      backgroundColor: colorValue,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(
      Number(value.value),
      [0, 1],
      [0, width.value - height.value],
    );
    const translateValue = withTiming(moveValue, {duration});

    return {
      transform: [{translateX: translateValue}],
      borderRadius: height.value / 2,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
          width.value = e.nativeEvent.layout.width;
        }}
        style={[switchStyles.track, style, trackAnimatedStyle]}>
        <Animated.View
          style={[
            switchStyles.thumb,
            ballStyle,
            thumbAnimatedStyle,
          ]}></Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const switchStyles = StyleSheet.create({
  track: {
    alignItems: 'flex-start',
    width: switchWidth,
    height: switchheight,
    padding: switchpadding,
    borderWidth: 1,
    borderColor: '#fff',
  },
  thumb: {
    height: '100%',
    aspectRatio: 1,
  },
});
