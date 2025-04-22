import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderCompo from '../../components/HeaderCompo';
import {BGline} from '../../assets/SVG/VectorSVG';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation';
import {useMutation} from '@tanstack/react-query';
import {postData} from '../../api';
import {storage} from '../../functions/storage';
import Urls from '../../api/urls';
const {width, height} = Dimensions.get('screen');

export default function QuestionResponse() {
  type formDataType = {
    mode: string;
    token: string;
    id: string;
    question_id: number;
    cType: string;
  };
  type response = {
    StatusCode: number;
    data: responseData;
  };
  type responseData = {
    guests: guestType[];
    options: optionType[];
  };
  type guestType = {
    name: string;
    choice: string;
    pic: string;
  };
  type optionType = {
    text: string;
    count: number;
  };
  type errorType = {
    error: {
      description: string;
    };
    StatusCode: number;
  };

  const {params} =
    useRoute<RouteProp<RootStackParamList, 'QuestionResponse'>>();
  const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
  const [selected, setSelected] = useState(params.choiceTxt || 'All');
  const [guestsData, setGuestsData] = useState<guestType[]>([]);
  const [optionsData, setOptionsData] = useState<optionType[]>([]);
  const [loading, setLoading] = useState({
    status: false,
    text: '',
  });

  useEffect(() => {
    callAPI();
  }, []);

  const callAPI = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    console.log('quesid type', typeof params.quesID, params.quesType);
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        mode: 'VIEW_MULTIPLE_CHOICE',
        token,
        id,
        question_id: params.quesID,
        cType: params.quesType,
      };
      setLoading({
        status: true,
        text: 'Getting Question Details',
      });
      console.log('formData', formData);

      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<response, errorType, formDataType>({
    mutationFn: (formData: formDataType) =>
      postData<formDataType, response>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        console.log('ohhdata', data);
        setGuestsData(data.guests);
        setOptionsData(data.options);
      }
      setLoading({
        status: false,
        text: '',
      });
    },
    onError: error => {
      setLoading({
        status: false,
        text: '',
      });
      console.log('error', error);
    },
  });

  const SelectedOption = ({
    text,
    count,
    selected,
    onPress,
  }: {
    text: string;
    count: number;
    selected: boolean;
    onPress: () => void;
  }) => {
    return (
      <Pressable
        onPress={onPress}
        style={{
          width: 'auto',
          paddingVertical: 13,
          paddingHorizontal: 15,
          backgroundColor: '#C5B1C33D',
          borderWidth: 1,
          borderColor: selected ? '#fff' : '#C5B1C33D',
          borderRadius: 40,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
          }}>
          <Text style={{color: '#fff'}}>{text}</Text>
          <Text>{count}</Text>
        </View>
      </Pressable>
    );
  };

  const filteredGuests =
    selected === 'All'
      ? guestsData
      : guestsData
          .filter(val => val.choice === selected)
          .map(val => ({name: val.name, pic: val.pic}));
  console.log('filteredGuests', filteredGuests);

  const renderGuest = (item, index) => {
    console.log('item,', item);
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingVertical: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}>
          <Image
            source={{
              uri: item?.item?.pic
                ? item?.item?.pic
                : `https://avatar.iran.liara.run/username?username=${item.name.replaceAll(
                    ' ',
                    '+',
                  )}`,
            }}
            style={{
              borderRadius: 100,
              width: 50,
              height: 50,
            }}
          />
          <Text style={{color: '#fff', fontSize: 15, fontWeight: 600}}>
            {item?.item?.name}
          </Text>
        </View>
        <Text
          style={{
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            paddingHorizontal: 20,
          }}>
          {item?.item?.choice}
        </Text>
      </View>
    );
  };

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
      <HeaderCompo />
      <BGline
        width={'100%'}
        height={height * 0.1}
        style={{
          position: 'absolute',
          top: Top_Height + height * 0.025,
          left: 0,
          right: 0,
        }}
      />
      <Text
        style={{
          color: '#F9BC52',
          fontSize: 18,
          fontWeight: 400,
          marginTop: 45,
          paddingHorizontal: 20,
        }}>
        {params.quesTxt}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingVertical: 20,
          paddingHorizontal: 15,
          gap: 10,
        }}>
        {optionsData.map((opt, index) => (
          <View>
            <SelectedOption
              key={index}
              text={opt.text}
              count={opt.count}
              selected={selected === opt.text}
              onPress={() => setSelected(opt.text)}
            />
          </View>
        ))}
      </View>
      <ScrollView
        contentContainerStyle={{
          // paddingBottom: invitedEvent ? 250 : 100,
          //   paddingTop: 25,
          paddingHorizontal: width * 0.05,
        }}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={loading}
        //     // onRefresh={mainFn}
        //     title="Pull to refresh"
        //     colors={['#F2F2F2']}
        //     progressBackgroundColor={'#0E0E0E'}
        //     titleColor="grey"
        //   />
        // }
      >
        <FlatList
          data={filteredGuests}
          renderItem={renderGuest}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>

      {/* {loading && <LoadingCompo text={'Getting event details'} />} */}
    </View>
  );
}
