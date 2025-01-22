import React, {memo} from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import Text from '../../../components/Text';
import Switch from '../../../components/Switch';
import SelectDropdown from 'react-native-select-dropdown';
import {DownSVG} from '../../../assets/SVG/IconsSVG';

const {width, height} = Dimensions.get('screen');
const paddingHorizontal = width * 0.05;

export default memo(() => {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView
        contentContainerStyle={{
          gap: 21,
          paddingBottom: 20,
          paddingHorizontal,
        }}>
        {/* <Text
          variant={'DetailRegular'}
          style={{
            color: '#fff',
          }}>
          Ask guests questions when they RSVP. Collect emails, dietary
          restrictions, anything.
        </Text> */}
      </ScrollView>
    </View>
  );
});




