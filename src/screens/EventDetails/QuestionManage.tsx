import React, { Component, useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextComponent,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { storage } from '../../functions/storage';
import { useMutation } from '@tanstack/react-query';
import { postData } from '../../api';
import Urls from '../../api/urls';
import LoadingCompo from '../../components/LoadingCompo';
import PopupCompo from '../../components/PopupCompo';
import { RadioButton } from 'react-native-paper';
import { find, set } from 'lodash';
import { navigate } from '../../functions/NavigationService';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MainStackNavigation, RootStackParamList } from '../../navigation';
const { width, height } = Dimensions.get('screen');
export default function ({ value }: { value: string }) {
  type errorType = {
    error: {
      description: string;
    };
    StatusCode: number;
  };
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
    id: number;
    text: string;
    type: string;
    choices: choiceType[];
  };
  type choiceType = {
    id: number;
    text: string;
  };
  type selectChoiceType = {
    quesID: number;
    choiceID: number;
    isChecked: boolean;
  };

  const { params } = useRoute<RouteProp<RootStackParamList, 'QuestionStats'>>();

  const navigation = useNavigation<MainStackNavigation>();

  const [questionData, setQuestionData] = useState<questionDataType[]>([]);
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
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        mode: 'VIEW_QUESTION',
        token,
        id,
        event_id: value,
      };
      setLoading({
        status: true,
        text: 'Getting Question Details',
      });
      mutation.mutate(formData);
    }
  };
  const mutation = useMutation<response, errorType, formDataType>({
    mutationFn: (formData: formDataType) =>
      postData<formDataType, response>(Urls.EVENT, formData),
    onSuccess: ({ data, StatusCode }) => {
      if (StatusCode === 200) {
        console.log('loaded', data);
        //   let temp = data.filter((val: questionData) => val.type === 'M');
        let tempArr: selectChoiceType[] = [];
        data.map(item => {
          if (item.type === 'M') {
            item.choices.map(choice => {
              tempArr.push({
                quesID: item.id,
                choiceID: choice.id,
                isChecked: false,
              });
            });
          }
        });

        setQuestionData(data);
        setChecked(tempArr);
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

  const renderQuestion = ({
    item,
    index,
  }: {
    item: questionDataType;
    index: string;
  }) => {
    // console.log('item', item.type);
    return item.type === 'M' ? (
      <RenderMultipleChoice
        quesTxt={item.text}
        quesID={item.id}
        choices={item.choices}
        cType={item.type}
      />
    ) : (
      <RenderTextQuestion
        quesTxt={item.text}
        quesID={item.id}
        cType={item.type}
      />
    );
  };
  function RenderTextQuestion({
    quesTxt,
    quesID,
    cType,
  }: {
    quesTxt: string;
    quesID: number;
    cType: string;
  }) {
    type textFormDataType = {
      mode: string;
      token: string;
      id: string;
      event_id: string;
      quesID: number;
      ans: string;
      cType: string;
    };
    console.log('id', value);
    const [textAns, setTextAns] = useState('');
    const [check, setCheck] = useState(false);

    const callAPI = (textAns: string, quesID: number) => {
      const token = storage.getString('user.token');
      const id = storage.getString('user.id');
      if (
        token !== null &&
        token !== undefined &&
        id !== null &&
        id !== undefined
      ) {
        const formData = {
          mode: 'INSERT_ANSWER',
          token,
          id,
          event_id: value,
          quesID: quesID,
          ans: textAns,
          cType: cType,
        };
        // setLoading({
        //   status: true,
        //   text: 'Getting Question Details',
        // });
        mutation.mutate(formData);
        console.log('formData', formData);
      }
    };

    const mutation = useMutation<response, errorType, textFormDataType>({
      mutationFn: (formData: formDataType) =>
        postData<formDataType, response>(Urls.EVENT, formData),
      onSuccess: ({ data, StatusCode }) => {
        if (StatusCode === 200) {
          console.log('textData', data);
          setTextAns('');
        }
        // setLoading({
        //   status: false,
        //   text: '',
        // });
      },
      onError: error => {
        setLoading({
          status: false,
          text: '',
        });
        console.log('error', error);
      },
    });

    return (
      <View style={{ marginBottom: 20 }}>
        <View style={styles.text_type_ques_row}>
          <Text style={styles.questionTxt}>{quesTxt}</Text>

          {check && (
            <TouchableOpacity
              style={styles.save_btn}
              onPress={() => callAPI(textAns, quesID)}>
              <Text style={{ color: '#000', fontWeight: 600 }}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          <TextInput
            placeholder="Type something..."
            value={textAns}
            onChangeText={text => {
              setTextAns(text);
              setCheck(true);
            }}
            style={styles.inputStyle}
          />
        </View>
      </View>
    );
  }

  function RenderMultipleChoice({
    quesTxt,
    quesID,
    cType,
    choices,
  }: {
    quesTxt: string;
    quesID: number;
    cType: string;
    choices: choiceType[];
  }) {
    type multiChoiceFormDataType = {
      mode: string;
      token: string;
      id: string;
      event_id: string;
      quesID: number;
      choiceID: number;
      cType: string;
    };
    const [checked, setChecked] = useState(0);

    const callAPI = (choiceID: number, quesID: number) => {
      setChecked(choiceID);
      const token = storage.getString('user.token');
      const id = storage.getString('user.id');
      if (
        token !== null &&
        token !== undefined &&
        id !== null &&
        id !== undefined
      ) {
        const formData = {
          mode: 'INSERT_ANSWER',
          token,
          id,
          event_id: value,
          quesID,
          choiceID,
          cType: cType,
        };
        // setLoading({
        //   status: true,
        //   text: 'Getting Question Details',
        // });
        mutation.mutate(formData);
        console.log('formData', formData);
      }
    };

    const mutation = useMutation<response, errorType, multiChoiceFormDataType>({
      mutationFn: (formData: multiChoiceFormDataType) =>
        postData<multiChoiceFormDataType, response>(Urls.EVENT, formData),
      onSuccess: ({ data, StatusCode }) => {
        if (StatusCode === 200) {
          console.log('multiChoice', data);
        }
        // setLoading({
        //   status: false,
        //   text: '',
        // });
      },
      onError: error => {
        setLoading({
          status: false,
          text: '',
        });
        console.log('error', error);
      },
    });

    const showChoices = (choices: choiceType[], quesId: number) => {
      return (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
          }}>
          {choices.map((item, index) =>
            renderChoices({ item, index, quesId }),
          )}
        </View>
      );
    };

    const renderChoices = ({
      item,
      index,
      quesId,
    }: {
      item: choiceType;
      index: number;
      quesId: number;
    }) => {
      return (
        <Pressable
          style={styles.choiceBox}
          onPress={() => {
            if (checked !== item.id) {
              callAPI(item.id, quesId);
            }
          }}>
          <RadioButton
            value={item.text}
            status={item.id === checked ? 'checked' : 'unchecked'}
            color={'#f7f7f7'}
            uncheckedColor="#f7f7f7"
            onPress={() => {
              if (checked !== item.id) {
                callAPI(item.id, quesId);
              }
            }}
          />
          <Text style={{ color: '#f7f7f7' }}>{item.text}</Text>
        </Pressable>
      );
    };

    return (
      <View style={{ marginBottom: 20 }}>
        <View style={styles.text_type_ques_row}>
          <Text style={styles.questionTxt}>{quesTxt}</Text>
        </View>
        {showChoices(choices, quesID)}
      </View>
    );
  }

  return (
    questionData.length > 0 && (
      <View>
        <View style={styles.heading_row}>
          <Text style={{ fontWeight: 600, fontSize: 18 }}>Questionnaires</Text>
          <TouchableOpacity
            style={styles.view_all_btn}
            onPress={() =>
              navigation.navigate('QuestionStats', { event_id: value })
            }>
            <Text style={styles.btn_text_style}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading.status && <LoadingCompo text={loading.text} />}
        <View>
          <FlatList
            scrollEnabled={false}
            data={questionData}
            renderItem={renderQuestion}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  btn_text_style: {
    color: '#000',
  },
  heading_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingVertical: 10,
  },

  text_type_ques_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  save_btn: {
    backgroundColor: '#F9BC52',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  view_all_btn: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  questionTxt: {
    color: '#F9BC52',
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 10,
  },
  inputStyle: {
    backgroundColor: '#C5B1C33D',
    borderRadius: 10,
    height: height * 0.1,
    textAlignVertical: 'top',
    paddingLeft: 15,
  },
  choiceBox: {
    backgroundColor: '#C5B1C340',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: width * 0.43,
  },
});
