import React, {memo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {NotiSVG, UsersSVG} from '../../../assets/SVG/IconsSVG';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../../navigation';

const {width, height} = Dimensions.get('screen');
const PIC_H = 50;
export default function ({
  country_code,
  id,
  name,
  number,
  pic,
}: {
  country_code: string;
  id: string;
  name: string;
  number: string;
  pic: string;
}) {
  const navigation = useNavigation<MainStackNavigation>();

  const onPress = () =>
    navigation.navigate('ProfileScreen', {
      country_code,
      id,
      name,
      number,
      pic,
    });

  const onContacts = () => navigation.navigate('ContactsScreen', {eventID: -1});
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
        }}>
        <Image
          source={require('../../../assets/images/Logo_W.png')}
          style={{
            height: PIC_H,
            width: (PIC_H * 178) / 58,
          }}
          resizeMode="contain"
        />
      </View>
      <Pressable
        onPress={onContacts}
        style={{
          padding: 10,
        }}>
        <UsersSVG width={30} height={30} />
      </Pressable>

      <Pressable
        style={{
          padding: 10,
        }}
        onPress={() => {
          ToastAndroid.showWithGravity(
            "Coming Soon",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }}>
        <NotiSVG width={30} height={30} />
      </Pressable>
      <ImageCompo uri={pic} onPress={onPress} />
    </View>
  );
}
const ImageCompo = memo(
  ({uri, onPress}: {uri: string; onPress: () => void}) => {
    const [loading, setLoading] = useState(false);

    return (
      <Pressable
        style={{
          height: 40,
          width: 40,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onPress}>
        {loading && (
          <ActivityIndicator
            color={'#fff'}
            style={{
              position: 'absolute',
            }}
          />
        )}
        <Image
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          source={{uri}}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 100,
          }}
        />
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
    paddingRight: 16,
  },
});
