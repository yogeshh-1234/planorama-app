import React, {memo, useCallback, useState} from 'react';
import {Dimensions, Pressable, StatusBar, View} from 'react-native';
import {BGline} from '../../assets/SVG/VectorSVG';
import HeaderCompo from '../../components/HeaderCompo';
import Text from '../../components/Text';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {DownSVG} from '../../assets/SVG/IconsSVG';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {
  errorType,
  importContactForm,
  importContactResponse,
} from './contactsType';
import {postData} from '../../api';
import Urls from '../../api/urls';
import {CommonActions, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MainStackNavigation, RootStackParamList} from '../../navigation';
import PopupCompo from '../../components/PopupCompo';
import LoadingCompo from '../../components/LoadingCompo';
import { CountryPicker } from 'react-native-country-codes-picker';

const {width, height} = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
export default function () {
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
      <View style={{flex: 1}}>
        <HeaderCompo />
        <View
          style={{
            // paddingTop: 30,
            paddingHorizontal: width * 0.05,
            gap: 18,
            flex: 1,
          }}>
          <View
            style={{
              gap: 18,
            }}>
            <Text
              variant={'TitleTwo'}
              style={{
                color: '#fff',
              }}
              entering={FadeIn}
              exiting={FadeOut}>
              Add new guest
            </Text>
            <Text
              variant={'BodyRegular'}
              style={{
                color: '#fff',
              }}
              entering={FadeIn.delay(100)}
              exiting={FadeOut}>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint.
            </Text>
          </View>
          <NewContactForm />
        </View>
      </View>
    </View>
  );
}

const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
const GAPONE = 20;
const GAPTWO = 10;
const NewContactForm = memo(() => {
   const {params} =
        useRoute<RouteProp<RootStackParamList, 'AddNewContact'>>();
  const navigation = useNavigation<MainStackNavigation>();
  const [name, setName] = useState('');
  const [num, setNum] = useState('');
  const [show, setShow] = useState(false);
  const [popupModal, setPopupModal] = useState(PopupModal);

  const [codeData, setCodeData] = useState({
    code: 'IN',
    dial_code: '+91',
    flag: '🇮🇳',
  });

  const [loading, setLoading] = useState({
    status: false,
    text: '',
  });

  const onDismiss = useCallback(() => {
    setPopupModal({...popupModal, state: false});
  }, [popupModal.state]);

  const buttOnePress = useCallback(() => {
    if (popupModal.buttOne === 'BACK') {
      setPopupModal({...popupModal, state: false});
    } else {
      setPopupModal({...popupModal, state: false});
    }
  }, [popupModal.state]);

  const buttTwoPress = useCallback(() => {
    if (popupModal.buttOne === 'BACK' && popupModal.buttTwo === 'RETRY') {
      onSubmitData();
    } else {
      setPopupModal({...popupModal, state: false});
    }
  }, [popupModal.state]);

  const onSubmitData = () => {
    if (!(name.length > 0)) {
      return;
    }

    if (!(num.length > 0)) {
      return;
    }

    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        mode: 'ADD_CONTACTS',
        token,
        id,
        contacts: JSON.stringify([
          {
            name,
            number: `${codeData.dial_code.replace(/\+/g, '')}${num}`,
            country_code: '',
          },
        ]),
      };


      setLoading({
        status: true,
        text: `Adding Contact...`,
      });

      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<
    importContactResponse,
    errorType,
    importContactForm
  >({
    mutationFn: (formData: importContactForm) =>
      postData<importContactForm, importContactResponse>(
        Urls.PROFILE,
        formData,
      ),
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        //
        if (params.onGoBack) params.onGoBack();
        navigation.goBack();
    
      } else {
        setLoading({
          status: false,
          text: '',
        });
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
    },
    onError: (error: errorType) => {
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
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          gap: GAPONE,
        }}>
        <Animated.View
          style={{
            gap: GAPTWO,
          }}
          entering={FadeIn.delay(200)}
          exiting={FadeOut}>
          <Text
            // entering={FadeInUp}
            variant={'BodyRegular'}
            style={{color: '#fff'}}>
            Name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            textInputProps={{
              maxLength: 15,
              keyboardType: 'default',
              returnKeyType: 'next',
              returnKeyLabel: 'Next',
              dataDetectorTypes: 'all',
              cursorColor: '#fff',
              selectionColor: '#2D2D2D',
            }}
            textInputStyle={{
              color: '#fff',
              fontFamily: 'PoppinsBold',
              fontWeight: '700',
              letterSpacing: 0,
              fontSize: 14,
              lineHeight: 21,
            }}
          />
        </Animated.View>
        <Animated.View
          style={{
            gap: GAPTWO,
          }}
          entering={FadeIn.delay(300)}
          exiting={FadeOut}>
          <Text
            variant={'BodyRegular'}
            style={{color: '#fff'}}>
            Mobile Number
          </Text>
          <Animated.View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Pressable
              style={{
                paddingHorizontal: 7,
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
              }}
              onPress={() => setShow(pre => !pre)}>
              <Text variant={'SubTitleTwo'} style={{color: '#fff'}}>
                {codeData.flag} {codeData.dial_code}
              </Text>
              <DownSVG width={16} height={16} />
            </Pressable>
            <View
              style={{
                flex: 1,
              }}>
              <TextInput
                value={num}
                onChangeText={setNum}
                textInputProps={{
                  maxLength: 15,
                  keyboardType: 'number-pad',
                  returnKeyType: 'send',
                  returnKeyLabel: 'GO!',
                  dataDetectorTypes: 'phoneNumber',
                  cursorColor: '#fff',
                  selectionColor: '#2D2D2D',
                }}
                textInputStyle={{
                  letterSpacing: 3,
                  color: '#fff',
                  fontFamily: 'PoppinsSemiBold',
                  fontWeight: '600',
                  fontSize: 16,
                  lineHeight: 24,
                }}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </View>
      <Animated.View
        style={{
          paddingBottom: 20,
        }}>
        <Button
          lable="ADD TO LIST"
          textStyles={{
            color: '#2D2D2D',
          }}
          buttonStyles={{
            backgroundColor: '#F9BC52',
            borderRadius: 10,
          }}
          onPress={() => {
            onSubmitData();
          }}
        />
      </Animated.View>
      <CountryPicker
        show={show}
        lang="en"
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={item => {
          setCodeData({
            code: item.code,
            dial_code: item.dial_code,
            flag: item.flag,
          });
          setShow(false);
        }}
        onRequestClose={() => {
          setShow(false);
        }}
        onBackdropPress={() => {
          setShow(false);
        }}
        style={{
          // Styles for whole modal [View]
          modal: {
            height: height * 0.6,
            backgroundColor: '#75486F',
          },
          // Styles for modal backdrop [View]
          backdrop: {},
          // Styles for bottom input line [View]
          line: {
            backgroundColor: '#C5B1C33D',
          },
          // Styles for list of countries [FlatList]
          itemsList: {
            // #C5B1C33D
            // backgroundColor:'red'
          },
          // Styles for input [TextInput]
          textInput: {
            //   height: 80,
            //   borderRadius: 0,
            color: '#fff',
            backgroundColor: '#C5B1C33D',
          },
          // Styles for country button [TouchableOpacity]
          countryButtonStyles: {
            //   height: 80
            backgroundColor: '#C5B1C33D',
          },
          // Styles for search message [Text]
          searchMessageText: {
            color: '#fff',
          },
          // Styles for search message container [View]
          countryMessageContainer: {},
          // Flag styles [Text]
          flag: {},
          // Dial code styles [Text]
          dialCode: {
            color: '#fff',
          },
          // Country name styles [Text]
          countryName: {
            color: '#fff',
          },
        }}
        inputPlaceholderTextColor={'#ffffff80'}
      />
      <PopupCompo
        isVisible={popupModal.state}
        onDismiss={onDismiss}
        title={popupModal.title}
        disc={popupModal.disc}
        buttOne={popupModal.buttOne}
        buttTwo={popupModal.buttTwo}
        buttOnePress={buttOnePress}
        buttTwoPress={buttTwoPress}
      />
      {loading.status && <LoadingCompo text={loading.text} />}
    </View>
  );
});
