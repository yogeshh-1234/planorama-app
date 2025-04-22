import React, {memo, useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../../../components/Text';
import SelectDropdown from 'react-native-select-dropdown';
import {DownSVG} from '../../../assets/SVG/IconsSVG';
import CustomCheckBox from '../../../components/CheckBox';
import HeaderCompo from '../../../components/HeaderCompo';
import {BGline} from '../../../assets/SVG/VectorSVG';
import {colorKeys} from 'moti';
import PopupCompo from '../../../components/PopupCompo';
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {MainStackNavigation, RootStackParamList} from '../../../navigation';
import LoadingCompo from '../../../components/LoadingCompo';
import {useMutation} from '@tanstack/react-query';
import {storage} from '../../../functions/storage';
import {postData} from '../../../api';
import Urls from '../../../api/urls';

const {width, height} = Dimensions.get('screen');
const paddingHorizontal = width * 0.05;

export default memo(() => {
  type Choice = {
    id: number;
    choiceText: string;
  };

  type Question = {
    id: number;
    quesText: string;
    format: string;
    choices: Choice[];
  };

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
    EventID: string;
    questions: string;
  };

  type questionResponse = {
    StatusCode: number;
    data: [];
  };

  const PopupModal = {
    state: false,
    title: '',
    disc: '',
    buttOne: '',
    buttTwo: '',
  };
  const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
  const {params} = useRoute<RouteProp<RootStackParamList, 'Questionnaire'>>();
  const options: DropdownItem[] = [
    {title: 'Text', id: 1},
    {title: 'List', id: 2},
  ];
  const navigation = useNavigation<MainStackNavigation>();
  // const [dropDownValue, setDropDownValue] = useState(1);
  const [checked, setChecked] = useState(false);
  const [questions, setQuestion] = useState<Question[]>([
    {
      id: 1,
      quesText: '',
      format: 'S',
      choices: [],
    },
  ]);
  const [loading, setLoading] = useState({
    status: false,
    text: '',
  });

  // console.log('questions', questions);

  const addQuestionFunction = () => {
    const nextQuestionId =
      questions.length > 0 ? questions[questions.length - 1]?.id + 1 : 1;
    const newQuestion: Question = {
      id: nextQuestionId,
      quesText: '',
      format: 'S',
      choices: [],
    };
    setQuestion(prev => [...prev, newQuestion]);
  };
  const [popupModal, setPopupModal] = useState(PopupModal);

  const deleteQuestion = (id: number) => {
    let filteredQuestions = questions.filter((val, idx) => val.id !== id);
    setQuestion(filteredQuestions);
  };

  const handleOnQuesChange = (text: string, id: number) => {
    setQuestion(prev =>
      prev.map(val =>
        id === val.id
          ? {
              ...val,
              quesText: text,
            }
          : val,
      ),
    );
  };

  const storeAnsFormat = (id: number, title: string) => {
    let ansFormat = title === 'Text' ? 'S' : 'M';
    setQuestion(prev =>
      prev.map(val =>
        val.id === id
          ? ansFormat === 'S'
            ? {
                ...val,
                format: ansFormat,
                choice: [],
              }
            : {
                ...val,
                format: ansFormat,
                choices: [
                  ...val.choices,
                  {
                    id:
                      val.choices.length > 0
                        ? val.choices[val.choices.length - 1].id
                        : 1,
                    choiceText: '',
                  },
                ],
              }
          : val,
      ),
    );
  };

  const addChoices = (id: number) => {
    setQuestion(prev =>
      prev.map(val =>
        val.id === id
          ? {
              ...val,
              choices: [
                ...val.choices,
                {
                  id:
                    val.choices.length > 0
                      ? val.choices[val.choices.length - 1]?.id + 1
                      : 1,
                  choiceText: '',
                },
              ],
            }
          : val,
      ),
    );
  };

  const handleOnChoiceChange = (text: string, quesId: number, cId: number) => {
    setQuestion(prev =>
      prev.map(val =>
        val.id === quesId
          ? {
              ...val,
              choices: val.choices.map(c =>
                c.id === cId
                  ? {
                      ...c,
                      choiceText: text,
                    }
                  : c,
              ),
            }
          : val,
      ),
    );
  };

  const deleteChoice = (quesId: number, cId: number) => {
    setQuestion(prev =>
      prev.map(val =>
        val.id === quesId
          ? {
              ...val,
              choices: val.choices.filter(c => c.id !== cId),
            }
          : val,
      ),
    );
  };

  const renderQuestion = (val: Question, index: number) => {
    <View>
      <View style={styles.selection_row}>
        <View style={styles.drop_down}>
          <SelectDropdown
            data={options}
            defaultValue={val.format === 'S' ? 'Text' : 'List'} // 👈 Sets "Test" as default
            onSelect={(selectedItem, index) => {
              console.log(selectedItem);
              // setDropDownValue(selectedItem.id);
              storeAnsFormat(val.id, selectedItem.title);
            }}
            buttonTextAfterSelection={selectedItem => selectedItem.title}
            rowTextForSelection={item => item.title}
            renderButton={(selectedItem, isOpened) => (
              <TouchableOpacity activeOpacity={0.8}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>
                    {val.format === 'S' ? 'Text' : 'List'}
                  </Text>
                  <DownSVG width={12} height={12} />
                </View>
              </TouchableOpacity>
            )}
            renderItem={(item, index, isSelected) => (
              <View style={[styles.dropdownItem]}>
                <Text style={styles.textColor}>{item.title}</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdown}
          />
        </View>
        <View style={styles.check_delete_block}>
          <Pressable onPress={() => setChecked(pre => !pre)}>
            <CustomCheckBox
              checked={checked}
              height={20}
              width={20}
              checkMarkColor={'#fff'}
              checkedBorderColor={'#fff'}
              unCheckedBorderColor={'#fff'}
              checkedBackgroundColor={'#fff'}
              unCheckedBackgroundColor={'#fff'}
              duration={300}
            />
          </Pressable>
          <Text style={styles.textColor}>Required</Text>

          {/* delete question */}
          <TouchableOpacity
            style={styles.deleteQuestion_btn}
            onPress={() => deleteQuestion(val.id)}>
            <Text style={styles.delete_icon}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
      {val.format === 'S' ? (
        <View>
          <TextInput
            style={styles.input_style}
            placeholder="Eg: Any extra items"
            placeholderTextColor="#C5B1C33D"
            value={val.quesText}
            onChangeText={text => handleOnQuesChange(text, val.id)}
          />
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input_style}
            placeholder="Eg: Need Beverages"
            placeholderTextColor="#C5B1C33D"
            value={val.quesText}
            onChangeText={text => handleOnQuesChange(text, val.id)}
          />
          <Text
            style={{
              fontSize: 15,
              color: '#f7f7f7',
              paddingVertical: 12,
            }}>
            Options
          </Text>

          {/* flatlist to render choices */}
          <FlatList
            data={val.choices}
            renderItem={({item: choiceItem, index}) =>
              renderChoices(choiceItem, index, val.id)
            }
            scrollEnabled={false}
          />

          {/* add choices */}
          <TouchableOpacity
            style={styles.addChoice_btn}
            onPress={() => addChoices(val.id)}>
            <Text style={styles.textColor}>+ Add Options</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>;
  };

  const renderChoices = (choice: Choice, index: number, quesId: number) => {
    <View>
      <View style={styles.choice_row}>
        <TextInput
          style={[styles.input_style, {width: '90%', marginBottom: 12}]}
          placeholder="Eg: Yes"
          placeholderTextColor="#C5B1C33D"
          value={choice.choiceText}
          onChangeText={text => handleOnChoiceChange(text, quesId, choice.id)}
        />
        {/* delete choices */}
        <TouchableOpacity
          style={styles.deleteQuestion_btn}
          onPress={() => deleteChoice(quesId, choice.id)}>
          <Text style={styles.delete_icon}>X</Text>
        </TouchableOpacity>
      </View>
    </View>;
  };

  // const onDismiss = useCallback(() => {
  //   setPopupModal({...popupModal, state: false});
  // }, [popupModal.state]);

  const buttOnePress = useCallback(() => {
    if (popupModal.buttOne === 'BACK') {
      setPopupModal({...popupModal, state: false});
    }
  }, [popupModal.state]);

  const buttTwoPress = useCallback(() => {
    if (popupModal.buttTwo === 'RETRY') {
      setPopupModal({...popupModal, state: false});
      callAPI();
    }
  }, [popupModal.state]);

  const sendData = () => {
    console.log('on send arr', questions);
    callAPI();
  };

  const onBack = () => {
    navigation.goBack();
  };

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
        mode: 'INSERT_QUESTION',
        token,
        id,
        EventID: params.eventID.toString(),
        questions: JSON.stringify(questions),
      };
      setLoading({
        status: true,
        text: 'Sending Message...',
      });
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<questionResponse, errorType, formDataType>({
    mutationFn: (formData: formDataType) =>
      postData<formDataType, questionResponse>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        console.log(params.eventID);

        // setContacts(
        //   data.contact_list.map(itm => ({
        //     id: itm.id.toString(),
        //     name: itm.name,
        //     number: itm.number,
        //     pic: itm.pic,
        //   })),
        // );
        // setPopupModal({
        //   state: true,
        //   title: "Question Inserted Successfully",
        //   disc: "click on ok ",
        //   buttOne: 'BACK',
        //   buttTwo: 'RETRY',
        // });
        // Alert.alert('Question saved successfully!');
        // ;
        // navigation.goBack();
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'HomeScreen',
              },
              {
                name: 'EventDetails',
                params: {id: params.eventID},
              },
            ],
          }),
        );
        // console.log('data', data);
      } else {
        setPopupModal({
          state: true,
          title: `Oops! Something went wrong.${
            StatusCode ? ` [${StatusCode}]` : ''
          }`,
          disc: "We couldn't complete your request, please try again!",
          buttOne: 'BACK',
          buttTwo: 'RETRY',
        });
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

      setPopupModal({
        state: true,
        title: `Oops! Something went wrong.${
          error?.StatusCode ? ` [${error.StatusCode}]` : ''
        }`,
        disc: error?.error?.description
          ? error.error.description
          : "We couldn't complete your request, please try again!",
        buttOne: 'BACK',
        buttTwo: 'RETRY',
      });
    },
  });

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
      <HeaderCompo showSave={true} onSave={sendData} onBack={onBack} />
      <BGline
        width={'100%'}
        height={height * 0.1}
        style={{
          position: 'absolute',
          top: Top_Height + height * 0.03,
          left: 0,
          right: 0,
        }}
      />
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          flexDirection: 'column',
          gap: 15,
        }}>
        <Text style={{color: '#f7f7f7', fontSize: 22, fontWeight: 600}}>
          Questionnaire
        </Text>
        <Text
          variant={'DetailRegular'}
          style={{
            color: '#fff',
          }}>
          Ask guests questions when they RSVP. Collect emails, dietary
          restrictions, anything.
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          gap: 21,
          paddingBottom: 20,
          paddingHorizontal,
        }}>
        {questions.map(val => (
          <View>
            <View style={styles.selection_row}>
              <View style={styles.drop_down}>
                <SelectDropdown
                  data={options}
                  defaultValue={val.format === 'S' ? 'Text' : 'List'} // 👈 Sets "Test" as default
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem);
                    // setDropDownValue(selectedItem.id);
                    storeAnsFormat(val.id, selectedItem.title);
                  }}
                  buttonTextAfterSelection={selectedItem => selectedItem.title}
                  rowTextForSelection={item => item.title}
                  renderButton={(selectedItem, isOpened) => (
                    <TouchableOpacity activeOpacity={0.8}>
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>
                          {val.format === 'S' ? 'Text' : 'List'}
                        </Text>
                        <DownSVG width={12} height={12} />
                      </View>
                    </TouchableOpacity>
                  )}
                  renderItem={(item, index, isSelected) => (
                    <View style={[styles.dropdownItem]}>
                      <Text style={styles.textColor}>{item.title}</Text>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdown}
                />
              </View>
              <View style={styles.check_delete_block}>
                <Text style={styles.textColor}>Required</Text>
                {/* delete question */}
                <TouchableOpacity
                  style={styles.deleteQuestion_btn}
                  onPress={() => deleteQuestion(val.id)}>
                  <Text style={styles.delete_icon}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
            {val.format === 'S' ? (
              <View>
                <TextInput
                  style={styles.input_style}
                  placeholder="Eg: Any extra items"
                  placeholderTextColor="#C5B1C33D"
                  value={val.quesText}
                  onChangeText={text => handleOnQuesChange(text, val.id)}
                />
              </View>
            ) : (
              <View>
                <TextInput
                  style={styles.input_style}
                  placeholder="Eg: Need Beverages"
                  placeholderTextColor="#C5B1C33D"
                  value={val.quesText}
                  onChangeText={text => handleOnQuesChange(text, val.id)}
                />
                <Text
                  style={{
                    fontSize: 15,
                    color: '#f7f7f7',
                    paddingVertical: 12,
                  }}>
                  Options
                </Text>
                {val.choices.map((choice, idx) => (
                  <View style={styles.choice_row}>
                    <TextInput
                      style={[
                        styles.input_style,
                        {width: '90%', marginBottom: 12},
                      ]}
                      placeholder="Eg: Yes"
                      placeholderTextColor="#C5B1C33D"
                      value={choice.choiceText}
                      onChangeText={text =>
                        handleOnChoiceChange(text, val.id, choice.id)
                      }
                    />
                    <TouchableOpacity
                      style={styles.deleteQuestion_btn}
                      onPress={() => deleteChoice(val.id, choice.id)}>
                      <Text style={styles.delete_icon}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {/* add choices */}
                <TouchableOpacity
                  style={styles.addChoice_btn}
                  onPress={() => addChoices(val.id)}>
                  <Text style={styles.textColor}>+ Add Options</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* flatlist to render question */}
        <FlatList
          data={questions}
          renderItem={renderQuestion}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={{paddingHorizontal: 10}}
        />

        {/* add question button */}
        <TouchableOpacity
          style={styles.addQuestion_btn}
          onPress={addQuestionFunction}>
          <Text style={[styles.textColor, {textAlign: 'center'}]}>
            + Add Question
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {loading.status && <LoadingCompo text={loading.text} />}
      <PopupCompo
        isVisible={popupModal.state}
        // onDismiss={onDismiss}
        title={popupModal.title}
        disc={popupModal.disc}
        buttOne={popupModal.buttOne}
        buttTwo={popupModal.buttTwo}
        buttOnePress={buttOnePress}
        buttTwoPress={buttTwoPress}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  textColor: {
    color: '#f7f7f7',
  },
  delete_icon: {fontSize: 10, color: '#75486F'},
  selection_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  input_style: {
    backgroundColor: '#C5B1C33D',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 15,
    fontWeight: 500,
  },

  check_delete_block: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },

  choice_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  addChoice_btn: {
    // width: 180,
    paddingHorizontal: 5,
    paddingTop: 15,
    borderRadius: 30,
  },
  addQuestion_btn: {
    width: 150,
    // paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#f7f7f7',
  },

  deleteQuestion_btn: {
    paddingHorizontal: 6,
    borderRadius: 70,
    backgroundColor: '#f7f7f7',
  },

  drop_down: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    width: width * 0.15,
    // paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    gap: 1,
  },
  buttonText: {
    color: '#fff',
    flex: 1,
    fontSize: 15,
    // fontWeight: 'bold',
  },
  dropdownItem: {
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    // width: width * 0.3,
    // alignItems: 'center',
    color: '#f7f7f7',
    gap: 8,
    paddingHorizontal: 6,
    paddingVertical: 15,
    // borderBottomWidth: 0.5,
    borderColor: '#000',
  },
  dropdown: {
    borderRadius: 5,
  },
});
