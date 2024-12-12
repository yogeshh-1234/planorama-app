import {useNavigation} from '@react-navigation/native';
import {memo} from 'react';
import {MainStackNavigation} from '../navigation';
import {Pressable, View} from 'react-native';
import {DownSVG} from '../assets/SVG/IconsSVG';
import Text from './Text';

export default memo(() => {
  const navigation = useNavigation<MainStackNavigation>();
  return (
    <View
      style={{
        padding: 20,
      }}>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
        onPress={() => navigation.goBack()}>
        <DownSVG
          width={12}
          height={12}
          style={{
            transform: [{rotate: '90deg'}],
          }}
        />
        <Text variant={'SubTitleTwo'} style={{color: '#fff'}}>
          Back
        </Text>
      </Pressable>
    </View>
  );
});
