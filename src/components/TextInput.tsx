import React from 'react';
import {
  Pressable,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import {CloseSVG, LocSVG, SearchSVG} from '../assets/SVG/IconsSVG';

export default ({
  lable = '',
  value = '',
  iconName,
  iconsize = 20,
  onChangeText,
  textInputProps,
  textInputStyle,
  onRightButt,
}: {
  lable?: string;
  value?: string;
  iconName?: 'loc' | 'search';
  iconsize?: number;
  onChangeText?: (val: string) => void;
  textInputProps?: TextInputProps;
  textInputStyle?: TextStyle;
  onRightButt?: () => void;
}) => {
  const icon = () => {
    switch (iconName) {
      case 'loc':
        return <LocSVG width={iconsize} height={iconsize} />;
      case 'search':
        return <SearchSVG width={iconsize} height={iconsize} />;

      default:
        return <></>;
    }
  };

  const rightIcon = () => {
    switch (iconName) {
      case 'search':
        return (
          <Pressable onPress={onRightButt}>
            <CloseSVG
              fill={'#fff'}
              width={iconsize * 1.8}
              height={iconsize * 1.8}
            />
          </Pressable>
        );
      default:
        return <></>;
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#C5B1C33D',
        borderRadius: 10,
        paddingHorizontal: 12,
        gap: 12,
      }}>
      {icon()}
      <TextInput
        style={[
          {
            fontFamily: 'PoppinsBold',
            fontWeight: '700',
            letterSpacing: 0,
            fontSize: 25,
            lineHeight: 37.5,

            flex: 1,
          },
          textInputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        {...textInputProps}
      />
      {rightIcon()}
    </View>
  );
};
