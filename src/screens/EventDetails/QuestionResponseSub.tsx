import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation';
import HeaderCompo from '../../components/HeaderCompo';
import {BGline} from '../../assets/SVG/VectorSVG';
import {storage} from '../../functions/storage';
import {postData} from '../../api';
import {useMutation} from '@tanstack/react-query';
import Urls from '../../api/urls';
const {width, height} = Dimensions.get('screen');

export default function () {
  type formDataType = {
    mode: string;
    token: string;
    id: string;
    question_id: number;
    cType: string;
  };
  type response = {
    StatusCode: number;
    data: SubjectiveResponseData;
  };
  type SubjectiveResponseData = {
    type: string;
    guestResponse: GuestResponseType[];
  };
  type GuestResponseType = {
    name: string;
    ans: string;
    logo: string;
  };
  type errorType = {
    error: {
      description: string;
    };
    StatusCode: number;
  };
  const {params} =
    useRoute<RouteProp<RootStackParamList, 'QuestionResponseSub'>>();
  const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
  const [custResponse, setCustResponse] = useState<GuestResponseType[]>([]);
  const [loading, setLoading] = useState({
    status: false,
    text: '',
  });
  // const guestResponse = [
  //   {
  //     name: 'John',
  //     ans: '45-50',
  //     logo: '',
  //   },
  //   {
  //     name: 'Alice',
  //     ans: '28',
  //     logo: '',
  //   },
  //   {
  //     name: 'Bob',
  //     ans: 'I enjoyed the experience and found the interface to be very user-friendly.',
  //   },
  //   {
  //     name: 'Sara',
  //     ans: 'It helped me understand the topic better through practical examples and demos.',
  //   },
  //   {
  //     name: 'Mike',
  //     ans: 'Overall, I think this approach can save time and improve productivity quickly.',
  //   },
  //   {
  //     name: 'Mike',
  //     ans: 'Overall, I think this approach can save time and improve productivity quickly.',
  //   },
  //   {
  //     name: 'Mike',
  //     ans: 'Overall, I think this approach can save time and improve productivity quickly.',
  //   },
  //   {
  //     name: 'Mike',
  //     ans: 'Overall, I think this approach can save time and improve productivity quickly.',
  //   },
  //   {
  //     name: 'Mike',
  //     ans: 'Overall, I think this approach can save time and improve productivity quickly.',
  //   },
  // ];

  useEffect(() => {
    callAPI();
  }, []);

  const callAPI = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    // console.log('quesID,quesTxt', params.quesID, params.quesType);

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
        setCustResponse(data.guestResponse);
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

  const renderGuest = (item, index) => {
    return (
      <View style={{paddingVertical: 8}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 20,
            gap: 10,
          }}>
          <Image
            source={{
              uri: item?.item?.logo
                ? item?.item?.logo
                : `https://avatar.iran.liara.run/username?username=${item.item.name.replaceAll(
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
          <Text style={{color: '#fff'}}>{item?.item?.name}</Text>
        </View>
        <Text style={{color: '#fff', fontSize: 17}}>{item?.item?.ans}</Text>
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
          color: '#fff',
          fontSize: 26,
          fontWeight: 600,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        Questionnaire stats
      </Text>
      <Text
        style={{
          color: '#F9BC52',
          fontSize: 18,
          fontWeight: 600,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        {params.quesTxt}
      </Text>
      <ScrollView
        contentContainerStyle={{
          // paddingBottom: invitedEvent ? 250 : 100,
          // paddingTop: 25,
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
          data={custResponse}
          renderItem={renderGuest}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>

      {/* {loading && <LoadingCompo text={'Getting event details'} />} */}
    </View>
  );
}
