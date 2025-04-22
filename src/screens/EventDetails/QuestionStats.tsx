import {
  RouteProp,
  useNavigation,
  useRoute,
  validatePathConfig,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MainStackNavigation, RootStackParamList} from '../../navigation';
import HeaderCompo from '../../components/HeaderCompo';
import {
  GestureHandlerRootView,
  Pressable,
  RefreshControl,
  ScrollView,
} from 'react-native-gesture-handler';
import LoadingCompo from '../../components/LoadingCompo';
import {BGline} from '../../assets/SVG/VectorSVG';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import Urls from '../../api/urls';
import {postData} from '../../api';
const {width, height} = Dimensions.get('screen');

import {guestItemType} from '../EventGuest/EventGuestType';

export default function QuestionStats() {
  type formDataType = {
    mode: string;
    token: string;
    id: string;
    event_id: string;
  };
  type response = {
    StatusCode: number;
    data: questionDataType[];
  };
  type questionDataType = {
    id: string;
    quesTxt: string;
    cType: string;
    choices: choiceType[];
  };
  type choiceType = {
    id: number;
    choiceTxt: string;
    count: number;
    progress: number;
  };
  type errorType = {
    error: {
      description: string;
    };
    StatusCode: number;
  };
  type guestType = {
    iCustID: number;
    pic: string;
  };

  const eventGuest = [
    {
      id: 35,
      name: 'Sujjo',
      country_code: null,
      number: '919881799947',
      pic: null,
      rsvp_status: '',
      rsvp_invited: 'N',
      rsvp: 'R~Y',
      approved: 'Y',
      customer_contact: {
        id: 21,
        by_cust_id: 10,
      },
    },
    {
      id: 36,
      name: 'Shaan',
      country_code: null,
      number: '919370141518',
      pic: null,
      rsvp_status: 'Y',
      rsvp_invited: 'Y',
      rsvp: 'R~Y',
      approved: 'Y',
      customer_contact: {
        id: 22,
        by_cust_id: 10,
      },
    },
    {
      id: 67,
      name: 'TI Yogesh Chodankar',
      country_code: null,
      number: '919356181492',
      pic: null,
      rsvp_status: '',
      rsvp_invited: 'N',
      rsvp: 'I~N',
      approved: 'Y',
      customer_contact: {
        id: 42,
        by_cust_id: 10,
      },
    },
    {
      id: 68,
      name: 'TI Yogesh Chodankar',
      country_code: null,
      number: '904',
      pic: null,
      rsvp_status: '',
      rsvp_invited: 'N',
      rsvp: 'R~Y',
      approved: 'Y',
      customer_contact: {
        id: 43,
        by_cust_id: 10,
      },
    },
    {
      id: 69,
      name: 'TI Yogesh Chodankar',
      country_code: null,
      number: '9049019382',
      pic: null,
      rsvp_status: '',
      rsvp_invited: 'N',
      rsvp: 'R~Y',
      approved: 'Y',
      customer_contact: {
        id: 44,
        by_cust_id: 10,
      },
    },
    {
      id: 70,
      name: 'Ti Yogesh Shirodkar Int',
      country_code: null,
      number: '917887738442',
      pic: null,
      rsvp_status: '',
      rsvp_invited: 'N',
      rsvp: 'I~N',
      approved: 'Y',
      customer_contact: {
        id: 45,
        by_cust_id: 10,
      },
    },
    {
      id: 71,
      name: 'Ti Prathamesh',
      country_code: null,
      number: '919763049159',
      pic: null,
      rsvp_status: 'M',
      rsvp_invited: 'Y',
      rsvp: 'R~M',
      approved: 'Y',
      customer_contact: {
        id: 46,
        by_cust_id: 10,
      },
    },
  ];

  const {params} = useRoute<RouteProp<RootStackParamList, 'QuestionStats'>>();
  const navigation = useNavigation<MainStackNavigation>();
  const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
  const [questions, setQuestions] = useState<questionDataType[]>([]);

  useEffect(() => {
    callAPI();
  }, []);

  const callAPI = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    console.log(
      'eventid',
      storage.getString('user.token'),
      storage.getString('user.id'),
    );
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        mode: 'VIEW_QUESTION_PROGRESS',
        token,
        id,
        event_id: params.event_id,
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
        setQuestions(data);
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

  const [loading, setLoading] = useState({
    status: false,
    text: '',
  });

  const CustomerProgressBar = ({
    quesID,
    quesTxt,
    choiceID,
    progress,
    text,
    value,
    type,
  }: {
    quesID: number;
    quesTxt: string;
    choiceID: number;
    progress: number;
    text: string;
    value: number;
    type: string;
  }) => {
    return (
      <Pressable
        style={styles.container}
        onPress={() =>
          navigation.navigate('QuestionResponse', {
            event_id: params.event_id,
            quesType: type,
            quesID: quesID,
            quesTxt: quesTxt,
            choiceID: choiceID,
            choiceTxt: text,
          })
        }>
        {/* Progress bar container */}
        <View
          style={[
            styles.barBackground,
            {
              width: width * 0.8,
              height: height * 0.045,
              backgroundColor: '#A28997',
            },
          ]}>
          {/* Fill portion of the progress bar */}
          <View
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#7A566A',
              borderRadius: 12,
            }}></View>
          <View style={styles.text_container}>
            <Text style={styles.labelText}>{text}</Text>
            {/* Text always visible */}
          </View>
        </View>

        <Text style={styles.valueText}>{value}</Text>
      </Pressable>
    );
  };

  const renderChoices =
    (type: string, quesID: number, quesTxt: string) =>
    ({item}: {item: any}) => {
      // console.log('pregress', item);
      return (
        <View>
          <CustomerProgressBar
            quesID={quesID}
            quesTxt={quesTxt}
            choiceID={item.id}
            progress={item.progress}
            text={item.choiceTxt}
            value={item.count}
            type={type}
          />
        </View>
      );
    };

  const Questions = ({
    quesID,
    question,
    type,
    choices,
  }: {
    quesID: number;
    question: string;
    type: string;
    choices: [];
  }) => {
    return (
      <View
        style={{
          paddingVertical: 15,
        }}>
        <View>
          <Text
            style={{
              color: '#F9BC52',
              fontSize: 18,
              fontWeight: 400,
              paddingBottom: 5,
            }}>
            {question}
          </Text>
          <View>
            <FlatList
              data={choices}
              renderItem={renderChoices(type, quesID, question)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </View>
    );
  };

  const ImgCount = 3;
  const MemberImg = ({
    pic,
    idx,
    count,
  }: {
    pic: string;
    idx: number;
    count: number;
  }) => {
    const [loading, setLoading] = useState(false);
    return (
      <View
        style={{
          width: idx + 1 === (count > ImgCount ? ImgCount : count) ? 40 : 30,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: idx * -100 + 500,
        }}>
        <Image
          source={{uri: pic}}
          style={{
            borderRadius: 100,
            width: 40,
            height: 40,
          }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
        {loading && (
          <ActivityIndicator
            color="#fff"
            style={{
              position: 'absolute',
            }}
          />
        )}
      </View>
    );
  };

  const ImagesCompo = ({guest, count}: {guest: guestType[]; count: number}) => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {guest.map((item, idx) => (
            <MemberImg
              pic={
                item.pic
                  ? item.pic
                  : `https://avatar.iran.liara.run/username?username=${item.name.replaceAll(
                      ' ',
                      '+',
                    )}`
              }
              idx={idx}
              count={count}
              key={idx}
            />
            // <Text>{item}</Text>
          ))}
          {count > ImgCount && (
            <View
              style={{
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  borderRadius: 40,
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  backgroundColor: '#ffffff80',
                }}>
                <Text style={{color: '#fff'}}>+{count - ImgCount}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const SubjectiveQuestion = ({
    quesID,
    question,
    type,
    count,
    picArr,
  }: {
    quesID: number;
    question: string;
    type: string;
    count: number;
    picArr: [];
  }) => {
    // console.log('response', picArr);
    return (
      <View
        style={{
          paddingVertical: 15,
        }}>
        <Text style={{color: '#F9BC52', fontSize: 18, fontWeight: 400}}>
          {question}
        </Text>
        <Pressable
          onPress={() =>
            navigation.navigate('QuestionResponseSub', {
              event_id: params.event_id,
              quesType: type,
              quesID: quesID,
              quesTxt: question,
            })
          }
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <View>
            <Text style={{fontSize: 20, fontWeight: 500, color: '#fff'}}>
              Responses
            </Text>
            <Text style={{color: '#fff'}}>{count} Responded</Text>
          </View>
          {picArr.length > 0 && (
            <ImagesCompo guest={picArr} count={picArr.length} />
          )}
        </Pressable>
      </View>
    );
  };

  const renderQuestion = (val, index) => {
    console.log('val', val);

    return (
      <View>
        {val?.item?.cType === 'M' ? (
          <Questions
            quesID={val?.item?.id}
            question={val?.item?.quesTxt}
            type={val?.item?.cType}
            choices={val?.item?.choices}
          />
        ) : (
          <SubjectiveQuestion
            quesID={val?.item?.id}
            question={val?.item?.quesTxt}
            type={val?.item?.cType}
            count={val?.item?.count}
            picArr={val?.item?.responses}
          />
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
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
            // marginTop: 2,
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
          <View>
            <FlatList
              data={questions}
              renderItem={renderQuestion}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          {/* <Questions question={'Drinks Options'} /> */}
        </ScrollView>

        {/* {loading && <LoadingCompo text={'Getting event details'} />} */}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    alignItems: 'center',
  },
  barBackground: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3A2537',
    overflow: 'hidden',
  },
  labelText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  valueText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  text_container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 10,
  },
});
