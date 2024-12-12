import React from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import {LocSVG} from '../assets/SVG/IconsSVG';

export default ({
  lable = '',
  value = '',
  iconName,
  iconsize = 20,
  onChangeText,
  textInputProps,
  textInputStyle,
}: {
  lable?: string;
  value?: string;
  iconName?: 'loc';
  iconsize?: number;
  onChangeText?: (val: string) => void;
  textInputProps?: TextInputProps;
  textInputStyle?: TextStyle;
}) => {
  const icon = () => {
    switch (iconName) {
      case 'loc':
        return <LocSVG width={iconsize} height={iconsize} />;

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
    </View>
  );
};
