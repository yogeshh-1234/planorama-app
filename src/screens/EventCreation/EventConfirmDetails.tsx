import React from 'react';
import {Dimensions, Pressable, ScrollView, StatusBar, View} from 'react-native';
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {MainStackNavigation, RootStackParamList} from '../../navigation';
import DetailsCompo from '../EventDetails/DetailsCompo';
import Button from '../../components/Button';
import Text from '../../components/Text';
const {width, height} = Dimensions.get('screen');

export default function () {
  const navigation = useNavigation<MainStackNavigation>();

  const {params} =
    useRoute<RouteProp<RootStackParamList, 'EventConfirmDetails'>>();
    
  return (
    <View
      style={{
        backgroundColor: '#3A2537',
        flex: 1,
        paddingTop: StatusBar.currentHeight,
      }}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent
        barStyle={'light-content'}
      />
      <ScrollView
        contentContainerStyle={{
          paddingTop: height * 0.03,
          paddingBottom: 150,
          paddingHorizontal: width * 0.05,
          //   gap: 12,
        }}>
        <DetailsCompo
          title={params.title}
          fontId={params.fontId}
          cover_img={params.cover_img}
          bg_img={params.bg_img}
          colorHex={params.colorHex}
          date={params.date}
          time={params.time}
          location={params.location}
          description={params.description}
          rsvp={params.rsvp}
          gallery={params.gallery}
        />
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          gap: 12,
          alignItems: 'center',
        }}>
        <Button
          lable="+ ADD GUESTS"
          textStyles={{
            color: '#fff',
          }}
          onPress={() => {}}
          buttonStyles={{
            // width: 'auto',
            // paddingHorizontal:
            paddingVertical: 12,
            borderRadius: 500,
            backgroundColor: '#F9BC52',
          }}
        />
        <Pressable
          style={{
            width: width * 0.9,
            paddingVertical: 12,
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {name: 'HomeScreen'},
                  {
                    name: 'EventDetails',
                    params: {id: params.id},
                  },
                ],
              }),
            );
          }}>
          <Text
            variant={'BodyBold'}
            style={{
              color: '#fff',
            }}>
            SAVE EVENT
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
