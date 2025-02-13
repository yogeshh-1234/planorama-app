import React from 'react';
import {Image, View} from 'react-native';
import Animated from 'react-native-reanimated';
import Text from '../../../components/Text';
import moment from 'moment';

export default function ({
  uri,
  name,
  rsvp,
  time,
}: {
  uri: string;
  name: string;
  rsvp: string;
  time: string;
}) {
  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}>
      <Image
        source={{
          uri: uri
            ? uri
            : `https://avatar.iran.liara.run/username?username=${(name
                ? name
                : ''
              ).replaceAll(' ', '+')}`,
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 100,
        }}
      />
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text variant={'DetailBold'} style={{color: '#fff'}}>
            {name}{' '}
          </Text>
          <Text variant={'DetailBold'} style={{color: '#F9BC52'}}>
            •{' '}
            {rsvp === 'Y'
              ? 'Going'
              : rsvp === 'M'
              ? 'May be'
              : rsvp === 'N'
              ? 'Not Going'
              : ''}
          </Text>
        </View>

        <Text style={{color: '#ffffff80'}} variant={'DetailRegular'}>
          {moment(time, 'DD/MM/YY hh:mm a').fromNow()}
        </Text>
      </View>
    </Animated.View>
  );
}
