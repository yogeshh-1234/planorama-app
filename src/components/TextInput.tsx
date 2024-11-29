import React from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';

export default ({
  lable = '',
  value = '',
  onChangeText,
  textInputProps,
  textInputStyle,
}: {
  lable?: string;
  value?: string;
  onChangeText?: (val: string) => void;
  textInputProps?: TextInputProps;
  textInputStyle?: TextStyle;
}) => {
  return (
    <View>
      <TextInput
        style={[
          {
            backgroundColor: '#C5B1C33D',
            borderRadius: 10,
            fontFamily: 'PoppinsBold',
            fontWeight: '700',
            letterSpacing: 0,
            fontSize: 25,
            lineHeight: 37.5,
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
