import React from 'react';
import {View} from 'react-native';
export default function (props: any) {
  return (
    <View
      style={{
        backgroundColor: '#75486F',
        flex: 1,
      }}>
      {props}
    </View>
  );
}
