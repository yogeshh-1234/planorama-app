import React, {memo} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {BGline} from '../../assets/SVG/VectorSVG';
import Header from '../Dashboard/components/Header';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation';
import {EditSVG, LogoutSVG} from '../../assets/SVG/IconsSVG';
import Text from '../../components/Text';
import HeaderCompo from '../../components/HeaderCompo';
import {storage} from '../../functions/storage';

const {width, height} = Dimensions.get('screen');

const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

export default function () {
  const {params} = useRoute<RouteProp<RootStackParamList, 'ProfileScreen'>>();
  const logout = () => {
    storage.clearAll();
  };
  return (
    <View
      style={{
        backgroundColor: '#75486F',
        flex: 1,
        paddingTop: StatusBar.currentHeight,
      }}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent
        barStyle={'light-content'}
      />
      <BGline
        width={'100%'}
        height={height * 0.1}
        style={{
          position: 'absolute',
          top: Top_Height + height * 0.02,
          left: 0,
          right: 0,
        }}
      />

      <HeaderCompo />
      <ScrollView
        contentContainerStyle={{
          paddingTop: 50,
          paddingBottom: height * 0.04,
          paddingHorizontal: width * 0.05,
          gap: 100,
        }}>
        <ProfileCompo
          uri={params.pic}
          name={params.name}
          number={params.number}
          code={params.country_code}
        />
        <ItemCompo title={'Logout'} onPress={logout} />
      </ScrollView>
    </View>
  );
}

const ItemCompo = memo(
  ({title, onPress}: {title: string; onPress: () => void}) => {
    return (
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#C5B1C33D',
          borderRadius: 5,
          paddingHorizontal: 12,
          paddingVertical: 18,
          gap: 12,
        }}
        onPress={onPress}>
        <LogoutSVG />
        <Text
          variant={'BodyRegular'}
          style={{
            color: '#fff',
          }}>
          {title}
        </Text>
      </Pressable>
    );
  },
);

const ProfileCompo = memo(
  ({
    uri,
    name,
    number,
    code,
  }: {
    uri: string;
    name: string;
    number: string;
    code: string;
  }) => {
    return (
      <View
        style={{
          alignItems: 'center',
          gap: 20,
        }}>
        <View>
          <Image
            source={{uri}}
            style={{
              width: width * 0.25,
              height: width * 0.25,
              borderRadius: width * 0.25,
            }}
          />
          <View
            style={{
              backgroundColor: '#2D2D2D',
              borderRadius: 100,
              position: 'absolute',
              bottom: -13,
              alignSelf: 'center',
              padding: 6,
            }}>
            <EditSVG width={20} height={20} fill={'#fff'} />
          </View>
        </View>
        <View
          style={{
            gap: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <Text variant={'TitleOne'} style={{color: '#fff'}}>
              {name}
            </Text>
            <EditSVG width={20} height={20} fill={'#fff'} />
          </View>
          <Text
            variant={'BodyRegular'}
            style={{color: '#fff', alignSelf: 'center', textAlign: 'center'}}>
            +{code} {number}
          </Text>
        </View>
      </View>
    );
  },
);
