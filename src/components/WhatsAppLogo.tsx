import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {WASVG} from '../assets/SVG/IconsSVG';
import Text from './Text';

export default function ({
  loading = false,
  connected = true,
}: {
  loading?: boolean;
  connected?: boolean;
}) {
  return (
    <View>
      <View
        style={{
          backgroundColor: connected ? '#2FAB68' : '#E4A421',
          borderRadius: 100,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 14,
          gap: 8,
          position: 'absolute',
          top: -46,
          right: 20,
        }}>
        {loading ? (
          <ActivityIndicator color={'#fff'} />
        ) : (
          <WASVG width={20} height={20} fill={'#fff'} />
        )}
        <Text variant={'DetailRegular'} style={{color: '#fff'}}>
          {loading ? 'checking' : connected?'Connected':'Not Connected'}
        </Text>
      </View>
    </View>
  );
}
