import React, {useRef, useState, memo} from 'react';
import Svg, {Path} from 'react-native-svg';
import {
  createAnimatedPropAdapter,
  processColor,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import Animated, {
  useAnimatedProps,
  interpolateColor,
} from 'react-native-reanimated';



type CheckBoxProps = {

  checked: boolean;

  height: number;

  width: number;

  checkMarkColor: string;

  checkedBorderColor: string;

  unCheckedBorderColor: string;

  checkedBackgroundColor: string;

  unCheckedBackgroundColor: string;

  duration: number;

  SvgStyles?: object;
  
  index?: number;
};


const CustomCheckBox = memo((
  
  {
    checked,
    checkMarkColor,
    checkedBorderColor,
    unCheckedBorderColor,
    checkedBackgroundColor,
    unCheckedBackgroundColor,
    height,
    width,
    SvgStyles,
    index,
    duration = 1000,
  }:CheckBoxProps
) => {

  const progress = useDerivedValue(() => {
    return withTiming(checked ? 1 : 0, {duration});
  });

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 49 49"
      fill={'transparent'}
      style={SvgStyles}
      key={index}>
      <AnimatedColor
        progress={progress}
        checkedBorderColor={checkedBorderColor}
        unCheckedBorderColor={unCheckedBorderColor}
        checkedBackgroundColor={checkedBackgroundColor}
        unCheckedBackgroundColor={unCheckedBackgroundColor}
      />
      <AnimatedCheckMarkPath
        progress={progress}
        checkMarkColor={checkMarkColor}
      />
    </Svg>
  );
});

export default CustomCheckBox;
type AnimatedCheckMarkPathProps = {
  progress: Animated.DerivedValue<0 | 1>;
  checkMarkColor: string;
};

const AnimatedCheckMarkPath = memo((props: AnimatedCheckMarkPathProps) => {
  const {progress, checkMarkColor} = props;
  const [length, setLength] = useState(0);
  const pathRef = useRef<any>(null);
  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const checkMarkAnimation = useAnimatedProps(() => {
    const strokeDashoffset = length - length * progress.value;
    const opacity = progress.value;
    return {strokeDashoffset, opacity};
  });
  return (
    <AnimatedPath
      animatedProps={checkMarkAnimation}
      onLayout={() => {
        if (pathRef.current) {
          setLength(pathRef.current.getTotalLength());
        }
      }}
      ref={pathRef}
      d="M12 24.4068L20.6667 32.9999L36.5 17.1667"
      stroke={checkMarkColor}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={length}
    />
  );
});

type AnimatedColorProps = {
  progress: Animated.DerivedValue<0 | 1>;
  unCheckedBorderColor: string;
  checkedBorderColor: string;
  unCheckedBackgroundColor: string;
  checkedBackgroundColor: string;
};

const AnimatedColor = memo((props: AnimatedColorProps) => {
  const {
    progress,
    unCheckedBorderColor,
    checkedBorderColor,
    unCheckedBackgroundColor,
    checkedBackgroundColor,
  } = props;
  const AnimationColor = Animated.createAnimatedComponent(Path);
  // const animation = useAnimatedProps(() => {
  //   const fill = interpolateColor(
  //     progress.value,
  //     [0, 1],
  //     [unCheckedBackgroundColor, checkedBackgroundColor],
  //   );
  //   const stroke = interpolateColor(
  //     progress.value,
  //     [0, 1],
  //     [unCheckedBorderColor, checkedBorderColor],
  //   );
  //   return {fill, stroke};
  // });
  const animation = useAnimatedProps(
    () => {
      const fill = interpolateColor(
        progress.value,
        [0, 1],
        [unCheckedBackgroundColor, checkedBackgroundColor],
      );
      // const stroke = interpolateColor(
      //   progress.value,
      //   [0, 1],
      //   [unCheckedBorderColor, checkedBorderColor],
      // );
      return {
        fill,
        // stroke,
      };
    },
    [],
    createAnimatedPropAdapter(
      propss => {
        if (Object.keys(propss).includes('fill')) {
          propss.fill = {type: 0, payload: processColor(propss.fill)};
        }
        // if (Object.keys(propss).includes('stroke')) {
        //   propss.stroke = {type: 0, payload: processColor(propss.stroke)};
        // }
      },
      [
        // 'fill', 'stroke'
      ],
    ),
  );
  return (
    <AnimationColor
      animatedProps={animation}
      stroke={"#fff"}
      // d="M2 16C2 8.26801 8.26801 2 16 2H33C40.732 2 47 8.26801 47 16V33C47 40.732 40.732 47 33 47H16C8.26801 47 2 40.732 2 33V16Z"
      d="M 2 16 C 2 2 2 2 16 2 H 33 C 47 2 47 2 47 16 V 33 C 47 47 47 47 33 47 H 16 C 2 47 2 47 2 33 V 16 Z"
      strokeWidth={1}
    />
  );
});
