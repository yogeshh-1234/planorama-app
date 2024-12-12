import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {BGline} from '../../assets/SVG/VectorSVG';
import PopupCompo from '../../components/PopupCompo';
import {
  BinSVG,
  CalenderSVG,
  DownSVG,
  EditSVG,
  ImageSVG,
  QuesSVG,
  ThumbsUpSVG,
} from '../../assets/SVG/IconsSVG';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import {fonts} from '../../config/constants';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../components/Button';
import Modal from 'react-native-modal';
import ColorPicker, {
  HueSlider,
  OpacitySlider,
  Panel1,
  Preview,
  Swatches,
} from 'reanimated-color-picker';
import {Switch} from 'react-native-paper';
import {storage} from '../../functions/storage';
import Contacts from 'react-native-contacts';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../../navigation';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Urls from '../../api/urls';
import {useMutation} from '@tanstack/react-query';
import {
  eventError,
  eventItemType,
  eventSucccess,
  galleryForm,
} from './EveCreatType';
import {postData} from '../../api';
import LoadingCompo from '../../components/LoadingCompo';
import HeaderCompo from '../../components/HeaderCompo';

const {width, height} = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
const GapOne = 16;
const GapTwo = 12;

export default function () {
  const navigation = useNavigation<MainStackNavigation>();

  const [titleData, setTitleData] = useState({
    value: '',
    fontID: fonts[0].id,
  });
  const [mainImg, setMainImg] = useState('');
  const [bgImg, setBg] = useState({
    colorCode: '',
    image: '',
    repeat: false,
  });

  const [dateTime, setDateTime] = useState({
    date: '',
    time: '',
  });

  const [locationData, setLocationData] = useState({
    location: '',
    isOnline: false,
  });

  const [disc, setDisc] = useState('');

  const [rsvpStatus, setRSVPStatus] = useState<'Y' | 'N' | 'M' | null>(null);

  const [galleryArr, setGalleryArr] = useState<string[]>([]);

  const [eventID, setEventID] = useState(-1);

  //
  const [loading, setLoading] = useState({
    status: false,
    text: '',
  });

  //
  const [popupModal, setPopupModal] = useState(PopupModal);
  const onDismiss = useCallback(() => {
    // setPopupModal({...popupModal, state: false});
  }, [popupModal.state]);

  const buttOnePress = useCallback(() => {
    if (popupModal.buttOne === 'BACK') {
      setPopupModal({...popupModal, state: false});
    } else if (popupModal.buttOne === 'CANCEL') {
      navigateEvent();
      //
    } else {
      setPopupModal({...popupModal, state: false});
    }
  }, [popupModal.state]);

  const buttTwoPress = useCallback(() => {
    if (popupModal.buttOne === 'BACK' && popupModal.buttTwo === 'RETRY') {
      onSubmit();
    } else if (
      popupModal.buttOne === 'CANCEL' &&
      popupModal.buttTwo === 'RETRY'
    ) {
      saveGallery(eventID);
    } else {
      setPopupModal({...popupModal, state: false});
    }
  }, [popupModal.state]);

  const onSubmit = () => {
    if (!(titleData.value.length > 1)) {
      setPopupModal({
        state: true,
        title: `Please Enter Event Title!`,
        disc: 'Please enter complete event details.',
        buttOne: '',
        buttTwo: 'OKAY',
      });
      return;
    }
    if (!(mainImg.length > 1)) {
      setPopupModal({
        state: true,
        title: `Please Select Event Image!`,
        disc: 'Please enter complete event details.',
        buttOne: '',
        buttTwo: 'OKAY',
      });
      return;
    }
    if (!(dateTime.date.length > 1)) {
      setPopupModal({
        state: true,
        title: `Please Select Event Date!`,
        disc: 'Please enter complete event details.',
        buttOne: '',
        buttTwo: 'OKAY',
      });
      return;
    }
    if (!(dateTime.time.length > 1)) {
      setPopupModal({
        state: true,
        title: `Please Select Event Time!`,
        disc: 'Please enter complete event details.',
        buttOne: '',
        buttTwo: 'OKAY',
      });
      return;
    }
    if (!(dateTime.time.length > 1)) {
      setPopupModal({
        state: true,
        title: `Please Select Event Location!`,
        disc: 'Please enter complete event details.',
        buttOne: '',
        buttTwo: 'OKAY',
      });
      return;
    }
    if (!(dateTime.time.length > 1)) {
      setPopupModal({
        state: true,
        title: `Please Select Event RSVP!`,
        disc: 'Please enter complete event details.',
        buttOne: '',
        buttTwo: 'OKAY',
      });
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
        mode: 'ADD_EVENT',
        token: token,
        id: id,
        title: titleData.value,
        fontId: titleData.fontID,
        cover_img: mainImg,
        bg_img: bgImg.image,
        colorHex: bgImg.colorCode,
        date: dateTime.date,
        time: dateTime.time,
        type: locationData.isOnline ? 'on' : 'off',
        location: locationData.isOnline ? '' : locationData.location,
        link: locationData.isOnline ? locationData.location : '',
        eventHostIds: '',
        eventDisc: disc,
        rsvp: rsvpStatus,
      };
      setLoading({
        status: true,
        text: 'Saving Event...',
      });
      
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<eventSucccess, eventError, eventItemType>({
    mutationFn: (formData: eventItemType) =>
      postData<eventItemType, eventSucccess>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        if (galleryArr.length > 0) {
          setLoading({
            status: true,
            text: 'Uploading Gallery...',
          });
          setEventID(data.event_id);
          saveGallery(data.event_id);
        }else{
          setLoading({
            status: false,
            text: '',
          });
          navigateEvent();
        }
        //
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
    onError: (error: eventError) => {
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

  const saveGallery = (event_id: number) => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      mutationGallery.mutate({
        mode: 'ADD_GALLERY',
        token: token,
        id: id,
        event_id,
        gallery: galleryArr,
      });
    }
  };
  const mutationGallery = useMutation<eventSucccess, eventError, galleryForm>({
    mutationFn: (formData: galleryForm) =>
      postData<galleryForm, eventSucccess>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        setLoading({
          status: false,
          text: '',
        });
        navigateEvent();
      } else {
        setPopupModal({
          state: true,
          title: `Oops! Couldn't upload gallery images.${
            StatusCode ? ` [${StatusCode}]` : ''
          }`,
          disc: "We couldn't complete your request, please try again!",
          buttOne: 'CANCEL',
          buttTwo: 'RETRY',
        });
      }
      setLoading({
        status: false,
        text: '',
      });
    },
    onError: (error: eventError) => {
      setLoading({
        status: false,
        text: '',
      });

      setPopupModal({
        state: true,
        title: `Oops! Couldn't upload gallery images.${
          error?.StatusCode ? ` [${error.StatusCode}]` : ''
        }`,
        disc: error?.error?.description
          ? error.error.description
          : "We couldn't complete your request, please try again!",
        buttOne: 'CANCEL',
        buttTwo: 'RETRY',
      });
    },
  });

  const navigateEvent = () => {
    const params = {
      title: titleData.value,
      fontId: titleData.fontID,
      cover_img: mainImg,
      bg_img: bgImg.image,
      colorHex: bgImg.colorCode,
      date: dateTime.date,
      time: dateTime.time,
      location: locationData.location,
      description: disc,
      rsvp: rsvpStatus,
      gallery: galleryArr,
      id: eventID,
    };
    
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {name: 'HomeScreen'},
          {
            name: 'EventConfirmDetails',
            params,
          },
        ],
      }),
    );
  };

  return (
    <Animated.View
      style={{
        backgroundColor:
          bgImg.colorCode.length > 0 ? bgImg.colorCode : '#3A2537',
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
      {bgImg.image.length > 0 && (
        <Image
          source={{uri: bgImg.image}}
          style={{
            position: 'absolute',
            width: width,
            height: height,
          }}
          resizeMode={bgImg.repeat ? 'repeat' : 'cover'}
        />
      )}
      <ScrollView
        contentContainerStyle={{
          // paddingTop: height * 0.03,
          paddingBottom: height * 0.04,
        }}>
        <View
          style={{
            width: width * 0.85,
            alignSelf: 'center',
            gap: GapOne,
          }}>
          <Text
            variant={'TitleTwo'}
            style={[styles.color_W, {alignSelf: 'center', paddingBottom: 18}]}>
            Create Event
          </Text>

          <EventTitleCompo
            onTitleChange={value => {
              setTitleData(pre => ({
                ...pre,
                value,
              }));
            }}
            onFontChange={fontID => {
              setTitleData(pre => ({
                ...pre,
                fontID,
              }));
            }}
          />

          <ImageCompo
            getImage={baseImg => {
              setMainImg(baseImg);
            }}
          />

          <BackgroundDataCompo
            updateImg={image => {
              setBg(pre => ({
                ...pre,
                image,
                colorCode: '',
              }));
            }}
            changeRepeat={repeat => {
              setBg(pre => ({
                ...pre,
                repeat,
              }));
            }}
            getcolorCode={colorCode => {
              setBg(pre => ({
                ...pre,
                colorCode,
                image: '',
                repeat: false,
              }));
            }}
          />
          <DateTimeCompo
            defDate={dateTime.date}
            defTime={dateTime.time}
            onDateChange={dt => {
              setDateTime(pre => ({...pre, date: dt}));
            }}
            onTimeChange={tm => {
              setDateTime(pre => ({...pre, time: tm}));
            }}
          />

          <LocationCompo
            updateLocation={(val, isOn) => {
              setLocationData({
                location: val,
                isOnline: isOn,
              });
            }}
          />

          <HostedByCompo />

          <EventDiscCompo setDisc={setDisc} />

          <GalleryCompo
            galleryArr={galleryArr}
            setGalleryArr={(val: any) => setGalleryArr(val)}
          />

          <RSVPCompo
            onPress={val => {
              setRSVPStatus(val);
            }}
          />

          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              marginVertical: 24,
            }}>
            <Button
              lable="Save Event"
              onPress={onSubmit}
              buttonStyles={{
                backgroundColor: '#F9BC52',
                borderRadius: 500,
                paddingVertical: 12,
              }}
              variant="BodyBold"
            />
          </View>
        </View>
      </ScrollView>
      {loading.status && <LoadingCompo text={loading.text} />}
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
    </Animated.View>
  );
}

const EventTitleCompo = memo(
  ({
    onTitleChange,
    onFontChange,
  }: {
    onTitleChange: (val: string) => void;
    onFontChange: (val: string) => void;
  }) => {
    const [val, setVal] = useState('');
    const [selectedFont, setSelectedFont] = useState(fonts[0]);
    return (
      <View
        style={{
          gap: GapTwo,
        }}>
        <View style={styles.inputContain}>
          <Text variant={'BodyRegular'} style={[styles.color_W]}>
            Event Title
          </Text>
          <TextInput
            value={val}
            onChangeText={text => {
              setVal(text);
              onTitleChange(text);
            }}
            textInputStyle={{
              fontFamily: selectedFont.name,
              fontWeight: '600',
              letterSpacing: 0,
              fontSize: 18,
              lineHeight: 27,
              color: '#fff',
            }}
          />
        </View>
        <View>
          <ScrollView horizontal contentContainerStyle={{gap: 10}}>
            {fonts.map(itm => (
              <FontItem
                lable={itm.lable}
                font={itm.name}
                selected={selectedFont.id === itm.id}
                onPress={() => {
                  onFontChange(itm.id);
                  setSelectedFont(itm);
                }}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  },
);

const FontItem = memo(
  ({
    lable,
    font,
    selected,
    onPress,
  }: {
    lable: string;
    font: string;
    selected: boolean;
    onPress: () => void;
  }) => {
    return (
      <Pressable
        style={{
          borderColor: selected ? '#fff' : 'transparent',
          borderWidth: 1,
          backgroundColor: '#C5B1C33D',
          borderRadius: 500,
          paddingHorizontal: 18,
          paddingVertical: 12,
        }}
        onPress={onPress}>
        <Text
          style={{
            fontFamily: font,
            fontWeight: '400',
            letterSpacing: 0,
            fontSize: 12,
            lineHeight: 18,
            color: '#fff',
          }}>
          {lable}
        </Text>
      </Pressable>
    );
  },
);

const ImageCompo = memo(({getImage}: {getImage: (val: string) => void}) => {
  const [imageUri, setImageUri] = useState<{
    base64: string | undefined;
  }>({
    base64: '',
  });
  const handleUploadImage = () => {
    Alert.alert(
      'Upload Image',
      'Choose an option:',
      [
        {
          text: 'Capture Image',
          onPress: () => {
            launchCamera(
              {
                mediaType: 'photo',
                maxHeight: 500,
                maxWidth: 500,
                includeBase64: true,
              },
              response => {
                if (response.didCancel) {
                  // console.log('User cancelled image capture');
                } else if (response.errorCode) {
                  // console.log('Camera Error:', response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                  setImageUri({
                    base64: `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`,
                  });
                  getImage(
                    `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`,
                  );
                }
              },
            );
          },
        },
        {
          text: 'Select from Gallery',
          onPress: () => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                maxHeight: 500,
                maxWidth: 500,
                selectionLimit: 1,
                includeBase64: true,
              },
              response => {
                if (response.didCancel) {
                  // console.log('User cancelled image picker');
                } else if (response.errorCode) {
                  // console.log('Gallery Error:', response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                  setImageUri({
                    base64: `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`,
                  });
                  getImage(
                    `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`,
                  );
                }
              },
            );
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };
  return (
    <Pressable
      style={{
        width: width * 0.85,
        height: width * 0.85,
        borderRadius: 10,
        backgroundColor: '#C5B1C33D',
      }}
      onPress={handleUploadImage}>
      <Image
        source={
          imageUri?.base64
            ? {uri: imageUri.base64}
            : require('../../assets/images/EventImg.png')
        }
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 10,
        }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: width * 0.5,
          paddingTop: width * 0.2,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}>
        <EditSVG width={20} height={20} />
        <Text
          variant={'BodyRegular'}
          style={{
            color: '#fff',
          }}>
          Edit image
        </Text>
      </LinearGradient>
    </Pressable>
  );
});

const BackgroundDataCompo = memo(
  ({
    updateImg,
    changeRepeat,
    getcolorCode,
  }: {
    updateImg: (img: string) => void;
    changeRepeat: (rept: boolean) => void;
    getcolorCode: (code: string) => void;
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const onDismiss = () => setIsVisible(false);
    const [imageUri, setImageUri] = useState<{
      base64: string;
    }>({
      base64: '',
    });

    const [repeat, setRepeat] = useState(false);

    const handleUploadImage = () => {
      Alert.alert(
        'Upload Image',
        'Choose an option:',
        [
          {
            text: 'Capture Image',
            onPress: () => {
              launchCamera(
                {
                  mediaType: 'photo',
                  maxHeight: 500,
                  maxWidth: 500,
                  includeBase64: true,
                },
                response => {
                  if (response.didCancel) {
                    // console.log('User cancelled image capture');
                  } else if (response.errorCode) {
                    // console.log('Camera Error:', response.errorMessage);
                  } else if (response.assets && response.assets.length > 0) {
                    setImageUri({
                      base64: `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`,
                    });

                    updateImg(
                      `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`,
                    );
                  }
                },
              );
            },
          },
          {
            text: 'Select from Gallery',
            onPress: () => {
              launchImageLibrary(
                {
                  mediaType: 'photo',
                  maxHeight: 500,
                  maxWidth: 500,
                  selectionLimit: 1,
                  includeBase64: true,
                },
                response => {
                  if (response.didCancel) {
                    // console.log('User cancelled image picker');
                  } else if (response.errorCode) {
                    // console.log('Gallery Error:', response.errorMessage);
                  } else if (response.assets && response.assets.length > 0) {
                    setImageUri({
                      base64: `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`,
                    });

                    updateImg(
                      `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`,
                    );
                  }
                },
              );
            },
          },
          {text: 'Cancel', style: 'cancel'},
        ],
        {cancelable: true},
      );
    };
    return (
      <View
        style={{
          gap: GapTwo,
        }}>
        <Text variant={'BodyRegular'} style={[styles.color_W]}>
          Background
        </Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 18,
          }}>
          <Pressable
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              flex: 1,
              paddingVertical: 16,
              alignItems: 'center',
            }}
            onPress={handleUploadImage}>
            <Text variant={'DetailBold'} style={{color: '#2D2D2D'}}>
              Upload image
            </Text>
          </Pressable>
          {imageUri.base64.length > 0 && (
            <Pressable
              style={{
                backgroundColor: repeat ? '#ffffffA1' : '#fff',
                borderRadius: 10,
                // flex: 1,
                paddingHorizontal: 12,
                paddingVertical: 16,
                alignItems: 'center',
              }}
              onPress={() => {
                setRepeat(pre => {
                  changeRepeat(!pre);
                  return !pre;
                });
              }}>
              <Text variant={'DetailBold'} style={{color: '#2D2D2D'}}>
                Repeat
              </Text>
            </Pressable>
          )}
          <Pressable
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              flex: 1,
              paddingVertical: 16,
              alignItems: 'center',
            }}
            onPress={() => setIsVisible(true)}>
            <Text variant={'DetailBold'} style={{color: '#2D2D2D'}}>
              Choose color
            </Text>
          </Pressable>
        </View>
        <ColorPickerModal
          isVisible={isVisible}
          onDismiss={onDismiss}
          onPress={hex => {
            onDismiss();
            getcolorCode(hex);
            setImageUri({base64: ''});
          }}
        />
      </View>
    );
  },
);

const ColorPickerModal = memo(
  ({
    isVisible,
    onDismiss,
    onPress,
  }: {
    isVisible: boolean;
    onDismiss: () => void;
    onPress: (val: string) => void;
  }) => {
    const onSelectColor = ({hex}: {hex: string}) => {
      setHexCode(hex);
    };
    const [hexCode, setHexCode] = useState('');
    return (
      <Modal
        isVisible={isVisible}
        style={{
          alignItems: 'center',
        }}
        animationIn={'zoomIn'}
        animationOut={'fadeOutDown'}
        onDismiss={onDismiss}
        onBackdropPress={onDismiss}
        onBackButtonPress={onDismiss}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 18,
            padding: width * 0.05,
          }}>
          <ColorPicker
            style={{width: '70%', gap: 10}}
            value="#75486F"
            onComplete={onSelectColor}>
            <Preview />
            <Panel1 />
            <HueSlider />
            <OpacitySlider />
            <Swatches />
          </ColorPicker>
          <Button
            lable="Confirm"
            onPress={() => onPress(hexCode)}
            buttonStyles={{
              width: 'auto',
              paddingHorizontal: 12,
              paddingVertical: 12,
              backgroundColor: '#75486F',
            }}
          />
        </View>
      </Modal>
    );
  },
);

const DateTimeCompo = memo(
  ({
    defDate,
    defTime,
    onDateChange,
    onTimeChange,
  }: {
    defDate: string;
    defTime: string;
    onDateChange: (dt: string) => void;
    onTimeChange: (tm: string) => void;
  }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<Date>(new Date());
    const [dtType, setDtType] = useState<
      'date' | 'time' | 'datetime' | undefined
    >('date');

    const openDate = () => {
      setDtType('date');
      showDatePicker();
    };

    const openTime = () => {
      setDtType('time');
      showDatePicker();
    };

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
      if (dtType === 'date') {
        setDate(date);
        onDateChange(moment(date).format('DD/MM/YYYY'));
      }
      if (dtType === 'time') {
        setTime(date);
        onTimeChange(moment(time).format('hh:mm a'));
      }
      hideDatePicker();
    };

    return (
      <View
        style={{
          gap: GapTwo,
        }}>
        <Text variant={'BodyRegular'} style={[styles.color_W]}>
          Date & Time of the event
        </Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 20,
          }}>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 14,
              backgroundColor: '#C5B1C33D',
              flex: 1,
              borderRadius: 10,
            }}
            onPress={openDate}>
            <CalenderSVG width={18} height={18} color={'#fff'} />
            <Text
              variant={'BodyBold'}
              style={{color: defTime.length > 0 ? '#fff' : '#ffffff80'}}>
              {defDate.length > 0
                ? moment(date).format('DD/MM/YYYY')
                : 'DD/MM/YYYY'}
            </Text>
          </Pressable>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 14,
              backgroundColor: '#C5B1C33D',
              borderRadius: 10,
            }}
            onPress={openTime}>
            <Text
              variant={'BodyBold'}
              style={{color: defTime.length > 0 ? '#fff' : '#ffffff80'}}>
              {defTime.length > 0 ? moment(time).format('hh:mm a') : '00:00'}
            </Text>
          </Pressable>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={dtType}
          date={dtType === 'date' ? date : time}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    );
  },
);

const LocationCompo = memo(
  ({
    updateLocation,
  }: {
    updateLocation: (val: string, isOn: boolean) => void;
  }) => {
    const [value, setValue] = useState('');
    const [online, setOnline] = useState(false);
    return (
      <View
        style={{
          gap: GapTwo,
        }}>
        <Text variant={'BodyRegular'} style={[styles.color_W]}>
          Location / Link
        </Text>
        <TextInput
          value={value}
          onChangeText={text => {
            setValue(text);
            updateLocation(text, online);
          }}
          textInputProps={{
            placeholder: online ? 'Add Web URL' : 'Eg: Panjim',
            placeholderTextColor: '#ffffff80',
          }}
          textInputStyle={{
            fontSize: 14,
            lineHeight: 21,
            color: '#fff',
          }}
          iconName="loc"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}>
          <Switch
            color="#fff"
            value={online}
            onChange={() => setOnline(pre => !pre)}
          />
          <Text variant={'BodyRegular'} style={styles.color_W}>
            Online
          </Text>
        </View>
      </View>
    );
  },
);

const HostedByCompo = memo(() => {
  const [data, setProfileData] = useState({
    name: '',
    pic: '',
  });

  useEffect(() => {
    const tempName = storage.getString('user.name');
    const tempPic = storage.getString('user.pic');
    if (
      tempName !== null &&
      tempName !== undefined &&
      tempPic !== null &&
      tempPic !== undefined
    ) {
      setProfileData({
        pic: tempPic,
        name: tempName,
      });
    }
  }, []);

  return (
    <View
      style={{
        gap: GapTwo,
      }}>
      <Text variant={'BodyRegular'} style={[styles.color_W]}>
        Hosted by
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: 12,
          paddingVertical: 14,
          borderRadius: 10,
          backgroundColor: '#C5B1C33D',
        }}>
        <Image
          source={{
            uri: data.pic,
          }}
          style={{
            width: 21,
            height: 21,
            borderRadius: 100,
          }}
        />
        <Text variant={'BodyBold'} style={{color: '#fff'}}>
          {data.name}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: 12,
          paddingVertical: 14,
          borderRadius: 100,
          backgroundColor: '#C5B1C33D',
          alignSelf: 'flex-start',
        }}>
        <Text style={{color: '#ffffff80'}} variant={'BodyRegular'}>
          + Add Co host
        </Text>
      </View>
    </View>
  );
});

const EventDiscCompo = memo(({setDisc}: {setDisc: (val: string) => void}) => {
  const [value, setValue] = useState('');
  return (
    <View
      style={{
        gap: GapTwo,
      }}>
      <Text variant={'BodyRegular'} style={[styles.color_W]}>
        Event Description
      </Text>
      <TextInput
        textInputStyle={{
          fontFamily: 'PoppinsBold',
          fontWeight: '700',
          letterSpacing: 0,
          fontSize: 14,
          lineHeight: 21,
          minHeight: 100,
        }}
        textInputProps={{
          multiline: true,
          textAlignVertical: 'top',
        }}
        value={value}
        onChangeText={txt => {
          setValue(txt);
          setDisc(txt);
        }}
      />
    </View>
  );
});

const GalleryCompo = memo(
  ({
    galleryArr,
    setGalleryArr,
  }: {
    galleryArr: string[];
    setGalleryArr: (val: ((data: string[]) => void) | string[]) => void;
  }) => {
    const handleUploadImage = () => {
      Alert.alert(
        'Upload Image',
        'Choose an option:',
        [
          {
            text: 'Capture Image',
            onPress: () => {
              launchCamera(
                {
                  mediaType: 'photo',
                  maxHeight: 500,
                  maxWidth: 500,
                  includeBase64: true,
                },
                response => {
                  if (response.didCancel) {
                    // console.log('User cancelled image capture');
                  } else if (response.errorCode) {
                    // console.log('Camera Error:', response.errorMessage);
                  } else if (response.assets && response.assets.length > 0) {
                    const newImg = `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`;
                    setGalleryArr(pre => [...pre, newImg]);
                  }
                },
              );
            },
          },
          {
            text: 'Select from Gallery',
            onPress: () => {
              launchImageLibrary(
                {
                  mediaType: 'photo',
                  maxHeight: 500,
                  maxWidth: 500,
                  selectionLimit: 1,
                  includeBase64: true,
                },
                response => {
                  if (response.didCancel) {
                    // console.log('User cancelled image picker');
                  } else if (response.errorCode) {
                    // console.log('Gallery Error:', response.errorMessage);
                  } else if (response.assets && response.assets.length > 0) {
                    const newImg = `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`;
                    setGalleryArr(pre => [...pre, newImg]);
                  }
                },
              );
            },
          },
          {text: 'Cancel', style: 'cancel'},
        ],
        {cancelable: true},
      );
    };
    return (
      <View style={styles.viewSty}>
        <Text variant={'BodyRegular'} style={[styles.color_W]}>
          Photo Gallery
        </Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            gap: 20,
            paddingVertical: 12,
          }}>
          <Pressable
            style={styles.imgGalleryUp}
            onPress={() => {
              handleUploadImage();
            }}>
            <ImageSVG width={30} height={30} />
            <Text variant={'DetailRegular'} style={styles.upTxt}>
              Upload Image
            </Text>
          </Pressable>
          {galleryArr.map((itm, idx) => (
            <GalleryItem
              uri={itm}
              removeImg={() => {
                const arr = galleryArr;
                const index = idx;
                if (index !== -1) {
                  arr.splice(index, 1); // Remove the element at the index
                }
                setGalleryArr([...arr]);
              }}
            />
          ))}
        </ScrollView>
      </View>
    );
  },
);
const GalleryItem = memo(
  ({uri, removeImg}: {uri: string; removeImg: () => void}) => {
    const [delStatus, setDelStatus] = useState(false);

    return (
      <Pressable
        onPressIn={() => setDelStatus(true)}
        onPressOut={() => setDelStatus(false)}
        onLongPress={() => {
          Alert.alert(
            'Remove Selected Image',
            '',
            [
              {
                text: 'REMOVE',
                onPress: removeImg,
              },
              {text: 'Cancel', style: 'cancel'},
            ],
            {cancelable: true},
          );
        }}>
        <Image
          source={{
            uri,
          }}
          style={styles.imgStyles}
        />
        {delStatus && (
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              borderRadius: 10,
              backgroundColor: '#00000080',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <BinSVG width={16} height={16} fill="#fff" />
          </Pressable>
        )}
      </Pressable>
    );
  },
);
const IconSize = width * 0.15;
const RSVPCompo = memo(
  ({onPress}: {onPress: (val: 'Y' | 'N' | 'M') => void}) => {
    const [value, setValue] = useState('');
    return (
      <View
        style={{
          gap: GapTwo,
        }}>
        <Text variant={'BodyRegular'} style={[styles.color_W]}>
          RSVP
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
          <Pressable
            style={{
              alignItems: 'center',
              gap: 12,
              flex: 1,
            }}
            onPress={() => {
              onPress('Y');
              setValue('Y');
            }}>
            <ThumbsUpSVG
              width={IconSize}
              height={IconSize}
              fill={value === 'Y' ? '#FFF' : '#C5B1C3'}
            />
            <Text
              variant={value === 'Y' ? 'SubTitleTwo' : 'BodyRegular'}
              style={[
                styles.color_W,
                {
                  lineHeight: 24,
                },
              ]}>
              Going
            </Text>
          </Pressable>
          <Pressable
            style={{
              alignItems: 'center',
              gap: 12,
              flex: 1,
            }}
            onPress={() => {
              onPress('M');
              setValue('M');
            }}>
            <QuesSVG
              width={IconSize}
              height={IconSize}
              fill={value === 'M' ? '#FFF' : '#C5B1C3'}
            />
            <Text
              variant={value === 'M' ? 'SubTitleTwo' : 'BodyRegular'}
              style={[
                styles.color_W,
                {
                  lineHeight: 24,
                },
              ]}>
              May be
            </Text>
          </Pressable>
          <Pressable
            style={{
              alignItems: 'center',
              gap: 12,
              flex: 1,
            }}
            onPress={() => {
              onPress('N');
              setValue('N');
            }}>
            <ThumbsUpSVG
              width={IconSize}
              height={IconSize}
              fill={value === 'N' ? '#FFF' : '#C5B1C3'}
              style={{
                transform: [{rotate: '180deg'}],
              }}
            />
            <Text
              variant={value === 'N' ? 'SubTitleTwo' : 'BodyRegular'}
              style={[
                styles.color_W,
                {
                  lineHeight: 24,
                },
              ]}>
              No
            </Text>
          </Pressable>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  color_W: {
    color: '#fff',
  },
  inputContain: {
    gap: GapTwo,
  },
  viewSty: {
    gap: GapTwo,
  },
  imgGalleryUp: {
    backgroundColor: '#C5B1C33D',
    borderRadius: 10,
    height: 150,
    width: 150,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStyles: {
    borderRadius: 10,
    height: 150,
    width: 150,
  },
  upTxt: {
    color: '#fff',
    textAlign: 'center',
  },
});
