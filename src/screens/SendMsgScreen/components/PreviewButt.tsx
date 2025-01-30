import React, {memo} from 'react';
import {View} from 'react-native';
import Button from '../../../components/Button';
import {EyeSVG} from '../../../assets/SVG/IconsSVG';
export default memo(({onPress}: {onPress: () => void}) => (
  <View
    style={{
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      alignItems: 'center',
    }}>
    <Button
      lable="PREVIEW"
      onPress={onPress}
      buttonStyles={{
        backgroundColor: '#fff',
      }}
      textStyles={{
        color: '#2D2D2D',
      }}
      icon={() => <EyeSVG width={26} height={26} />}
    />
  </View>
));
