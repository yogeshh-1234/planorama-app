import React, {memo, useEffect, useState} from 'react';
import {ActivityIndicator, Image, Pressable, View} from 'react-native';
import Text from '../../components/Text';

export default memo(function ({
  credits,
  loading,
}: {
  credits: string;
  loading: boolean;
}) {
  useEffect(() => {
    getCredits();
  }, []);

  const getCredits = () => {};

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#C5B1C33D',
        borderRadius: 5,
        paddingHorizontal: 12,
        paddingVertical: 9,
        gap: 12,
      }}
      //   disabled={loading}
      //   onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={'#fff'} />
      ) : (
        <Image
          source={require('../../assets/images/coin.png')}
          style={{
            width: 20,
            height: 20,
          }}
        />
      )}
      <View>
        <Text
          variant={'DetailRegular'}
          style={{
            color: '#fff',
          }}>
          Available credits:
        </Text>
        <Text
          variant={'SubTitleTwo'}
          style={{
            color: '#fff',
          }}>
          {credits}
        </Text>
      </View>
    </Pressable>
  );
});
