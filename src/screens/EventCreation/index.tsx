import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {BGline} from '../../assets/SVG/VectorSVG';
import PopupCompo from '../../components/PopupCompo';
import {
  BinSVG,
  CalenderSVG,
  EditSVG,
  ImageSVG,
  SettingSVG,
} from '../../assets/SVG/IconsSVG';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import {fonts} from '../../config/constants';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../components/Button';
import {storage} from '../../functions/storage';
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {MainStackNavigation, RootStackParamList} from '../../navigation';
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
import {MotiView, useAnimationState} from 'moti';
import CustomCheckBox from '../../components/CheckBox';
import RSVPIconCompo from '../../components/RSVPIconCompo';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
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

  const {params} = useRoute<RouteProp<RootStackParamList, 'EventCreation'>>();
  const editEvent = params.eventID ? true : false;

  const [titleData, setTitleData] = useState({
    value: '',
    fontID: fonts[0].id,
  });
  const [mainImg, setMainImg] = useState({
    image: '',
  });
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

  const [rsvpStatus, setRSVPStatus] = useState<'Y' | 'N' | 'M' | '' | null>(
    null,
  );

  const [galleryArr, setGalleryArr] = useState<string[]>([]);

  const [eventID, setEventID] = useState(-1);

  useEffect(() => {
    setEditData();
  }, []);

  const setEditData = async () => {
    if (params?.eventData !== undefined) {
      setLoading({
        status: true,
        text: 'Getting Event details',
      });
      setTitleData({
        value: params?.eventData?.name,
        fontID: params?.eventData?.font_id.toString(),
      });

      setDateTime({
        date: params?.eventData?.date ? params?.eventData?.date : '',
        time: params?.eventData?.time ? params?.eventData?.time : '',
      });
      setLocationData({
        location:
          params?.eventData?.location.length > 0
            ? params?.eventData?.location
            : params?.eventData?.link,
        isOnline: params?.eventData?.type === 'off' ? false : true,
      });

      setDisc(params?.eventData?.event_disc);
      setRSVPStatus(params?.eventData?.rsvp);

      if (params?.eventData?.cover_img) {
        await setEventImgFn(params.eventData.cover_img);
      }
      if (params.galleryData && params.galleryData.length > 0) {
        await setGalleryFn(params?.galleryData);
      }
      setTimeout(() => {
        setLoading({
          status: false,
          text: '',
        });
      }, 200);
    }
  };

  const setEventImgFn = async (imgData: string) => {
    try {
      // Fetch the image
      const response = await fetch(imgData);
      const contentType = response.headers.get('Content-Type') || 'image/png'; // Fallback to PNG if Content-Type is not provided
      const blob = await response.blob();

      // Convert blob to Base64 using FileReader wrapped in a Promise
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = (reader.result as string).replace(
            /^data:application\/octet-stream/,
            `data:${contentType}`,
          ); // Replace the default MIME type if necessary
          resolve(base64Data);
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(blob);
      });

      setMainImg({
        image: base64,
      });
    } catch (error) {
      // console.error('Error converting image to Base64:', error);
    }
  };

  const setGalleryFn = async (galleryData: string[]) => {
    const newGalleryArr = await Promise.all(
      galleryData.map(async itm => {
        try {
          // Fetch the image
          const response = await fetch(itm);
          const contentType =
            response.headers.get('Content-Type') || 'image/png'; // Fallback to PNG if Content-Type is not provided
          const blob = await response.blob();

          // Convert blob to Base64 using FileReader wrapped in a Promise
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Data = (reader.result as string).replace(
                /^data:application\/octet-stream/,
                `data:${contentType}`,
              ); // Replace the default MIME type if necessary
              resolve(base64Data);
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(blob);
          });

          return base64;
        } catch (error) {
          // console.error('Error converting image to Base64:', error);
        }
      }),
    );
    // Filter out null values and ensure the type is string[]
    const filteredGalleryArr = newGalleryArr.filter(
      (item): item is string => item !== null,
    );
    setGalleryArr(filteredGalleryArr); // Correctly assign filtered array to state
  };

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
      navigateEvent(eventID);
      //
    }
    //  else {
    //   setPopupModal({...popupModal, state: false});
    // }
    setPopupModal({...popupModal, state: false});
  }, [popupModal.state]);

  const buttTwoPress = useCallback(() => {
    if (popupModal.buttOne === 'BACK' && popupModal.buttTwo === 'RETRY') {
      onSubmit();
    } else if (
      popupModal.buttOne === 'CANCEL' &&
      popupModal.buttTwo === 'RETRY'
    ) {
      saveGallery(eventID);
    }
    // else {
    //   setPopupModal({...popupModal, state: false});
    // }
    setPopupModal({...popupModal, state: false});
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
    if (!(mainImg.image.length > 1)) {
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
        mode: editEvent ? 'UPDATE_EVENT' : 'ADD_EVENT',
        token: token,
        id: id,
        event_id: editEvent ? (params.eventID ? params.eventID : null) : null,
        title: titleData.value,
        fontId: titleData.fontID,
        cover_img: mainImg.image,
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
      // event successfully registered
      if (StatusCode === 200) {
        // if gallery data exist
        if (galleryArr.length > 0 || editEvent) {
          setLoading({
            status: true,
            text: 'Uploading Gallery...',
          });

          // save event ID
          setEventID(
            editEvent ? (params.eventID ? params.eventID : -1) : data.event_id,
          );

          // upload gallery
          saveGallery(
            editEvent ? (params.eventID ? params.eventID : -1) : data.event_id,
          );
        } else {
          // else
          // check if event settings exist
          const tempSettingsData = storage.getString('SettingsData');
          if (tempSettingsData !== null && tempSettingsData !== undefined) {
            // save event settings for that event
            setEventSettings(data.event_id);
          } else {
            // else navigate

            navigateEvent(data.event_id);
          }
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
        gallery: JSON.stringify(galleryArr),
      });
    }
  };
  const mutationGallery = useMutation<eventSucccess, eventError, galleryForm>({
    mutationFn: (formData: galleryForm) =>
      postData<galleryForm, eventSucccess>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        // check if event settings exist
        const tempSettingsData = storage.getString('SettingsData');
        if (tempSettingsData !== null && tempSettingsData !== undefined) {
          // save event settings for that event
          setEventSettings(eventID);
        } else {
          // else navigate

          navigateEvent(eventID);
        }
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

  const setEventSettings = (event_id: number) => {
    const tempSettingsData = storage.getString('SettingsData');
    if (tempSettingsData !== null && tempSettingsData !== undefined) {
      const token = storage.getString('user.token');
      const id = storage.getString('user.id');
      if (
        token !== null &&
        token !== undefined &&
        id !== null &&
        id !== undefined
      ) {
        mutationSettings.mutate({
          ...JSON.parse(tempSettingsData),
          mode: 'UPDATE_EVENT_CONFIG',
          token,
          id,
          event_id: event_id,
        });
      }
    } else {
      navigateEvent(eventID);
    }
  };
  const mutationSettings = useMutation<eventSucccess, eventError, galleryForm>({
    mutationFn: (formData: galleryForm) =>
      postData<galleryForm, eventSucccess>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        navigateEvent(eventID);
      } else {
        setPopupModal({
          state: true,
          title: `Oops! Couldn't update Event Settings.${
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
        title: `Oops! Couldn't update Event Settings.${
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

  const navigateEvent = (newID?: number) => {
    setLoading({
      status: false,
      text: '',
    });
    const paramstoSend = {
      title: titleData.value,
      fontId: titleData.fontID,
      cover_img: mainImg.image,
      bg_img: bgImg.image,
      colorHex: bgImg.colorCode,
      date: dateTime.date,
      time: dateTime.time,
      location: locationData.isOnline ? '' : locationData.location,
      link: locationData.isOnline ? locationData.location : '',
      description: disc,
      rsvp: rsvpStatus,
      gallery: galleryArr,
      id: eventID === -1 ? newID : eventID,
    };
    storage.delete('SettingsData');

    if (editEvent === true) {
      if (params.onGoBack) params.onGoBack();
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {name: 'HomeScreen'},
            {
              name: 'EventConfirmDetails',
              params: paramstoSend,
            },
          ],
        }),
      );
    }
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
      {!loading.status && (
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
              entering={FadeIn}
              exiting={FadeOut}
              style={[
                styles.color_W,
                {alignSelf: 'center', paddingBottom: 18},
              ]}>
              {editEvent ? 'Edit' : 'Create'} Event
            </Text>

            <EventTitleCompo
              titleData={titleData}
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
              mainImg={mainImg.image}
              getImage={baseImg => {
                setMainImg({
                  image: baseImg,
                });
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
              locationData={locationData}
              updateLocation={(val, isOn) => {
                setLocationData({
                  location: val,
                  isOnline: isOn,
                });
              }}
            />

            <HostedByCompo />

            <EventDiscCompo disc={disc} setDisc={setDisc} />

            <GalleryCompo
              galleryArr={galleryArr}
              setGalleryArr={(val: any) => setGalleryArr(val)}
            />

            <RSVPCompo
              rsvpStatus={rsvpStatus}
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
      )}
      <SetingsIcon />
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
const SetingsIcon = memo(() => {
  const navigation = useNavigation<MainStackNavigation>();

  const buttState = useAnimationState({
    from: {
      rotate: '-45deg',
    },
    to: {
      rotate: '0deg',
    },
    pressd: {rotate: '-45deg'},
  });
  return (
    <Pressable
      style={{
        borderRadius: 100,
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#C5B1C3',
      }}
      onPressIn={() => buttState.transitionTo('pressd')}
      onPressOut={() => buttState.transitionTo('to')}
      onPress={() => {
        navigation.navigate('EventSettingsScreen', {});
      }}>
      <MotiView
        style={{
          borderRadius: 100,
          padding: 12,
        }}
        state={buttState}>
        <SettingSVG width={35} height={35} fill={'#fff'} />
      </MotiView>
    </Pressable>
  );
});
const EventTitleCompo = memo(
  ({
    titleData,
    onTitleChange,
    onFontChange,
  }: {
    titleData: {
      value: string;
      fontID: string;
    };
    onTitleChange: (val: string) => void;
    onFontChange: (val: string) => void;
  }) => {
    const [val, setVal] = useState('');
    const [selectedFont, setSelectedFont] = useState(fonts[0]);

    useEffect(() => {
      setVal(titleData.value);
      let fontIdx = fonts.findIndex(
        itm => itm.id.toString() === titleData.fontID.toString(),
      );
      if (fontIdx !== -1) {
        setSelectedFont(fonts[fontIdx]);
      }
    }, []);

    return (
      <Animated.View
        style={{
          gap: GapTwo,
        }}>
        <Animated.View
          style={styles.inputContain}
          entering={FadeIn.delay(150)}
          exiting={FadeOut}>
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
        </Animated.View>
        <View>
          <Animated.ScrollView
            horizontal
            contentContainerStyle={{gap: 10}}
            entering={FadeInRight.delay(300)}
            exiting={FadeOut}>
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
          </Animated.ScrollView>
        </View>
      </Animated.View>
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

const ImageCompo = memo(
  ({mainImg, getImage}: {mainImg: string; getImage: (val: string) => void}) => {
    //
    const [imageUri, setImageUri] = useState<{
      base64: string | undefined;
    }>({
      base64: '',
    });

    useEffect(() => {
      setImageUri({
        base64: mainImg,
      });
    }, []);

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
      <AnimatedPressable
        style={{
          width: width * 0.85,
          height: width * 0.85,
          borderRadius: 10,
          backgroundColor: '#gTttwtytwyy',
        }}
        entering={FadeIn.delay(400)}
        exiting={FadeOut}
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
      </AnimatedPressable>
    );
  },
);

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
      <Animated.View
        style={{
          gap: GapTwo,
        }}
        entering={FadeIn.delay(500)}
        exiting={FadeOut}>
        <Text variant={'BodyRegular'} style={[styles.color_W]}>
          Theme
        </Text>
        <Pressable
          onPress={() => {
            ToastAndroid.showWithGravity(
              'Coming Soon',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 14,
            backgroundColor: '#C5B1C33D',
            flex: 1,
            borderRadius: 10,
          }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              backgroundColor: '#212121',
              borderWidth: 1,
              borderColor: '#fff',
            }}
          />
          <Text variant={'DetailRegular'} style={{color: '#fff'}}>
            Select Theme
          </Text>
        </Pressable>
      </Animated.View>
    );
  },
);

// const ColorPickerModal = memo(
//   ({
//     isVisible,
//     onDismiss,
//     onPress,
//   }: {
//     isVisible: boolean;
//     onDismiss: () => void;
//     onPress: (val: string) => void;
//   }) => {
//     const onSelectColor = ({hex}: {hex: string}) => {
//       setHexCode(hex);
//     };
//     const [hexCode, setHexCode] = useState('');
//     return (
//       <Modal
//         isVisible={isVisible}
//         style={{
//           alignItems: 'center',
//         }}
//         animationIn={'zoomIn'}
//         animationOut={'fadeOutDown'}
//         onDismiss={onDismiss}
//         onBackdropPress={onDismiss}
//         onBackButtonPress={onDismiss}>
//         <View
//           style={{
//             backgroundColor: '#fff',
//             borderRadius: 18,
//             padding: width * 0.05,
//           }}>
//           <ColorPicker
//             style={{width: '70%', gap: 10}}
//             value="#75486F"
//             onComplete={onSelectColor}>
//             <Preview />
//             <Panel1 />
//             <HueSlider />
//             <OpacitySlider />
//             <Swatches />
//           </ColorPicker>
//           <Button
//             lable="Confirm"
//             onPress={() => onPress(hexCode)}
//             buttonStyles={{
//               width: 'auto',
//               paddingHorizontal: 12,
//               paddingVertical: 12,
//               backgroundColor: '#75486F',
//             }}
//           />
//         </View>
//       </Modal>
//     );
//   },
// );

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
      <Animated.View
        style={{
          gap: GapTwo,
        }}
        entering={FadeIn.delay(600)}
        exiting={FadeOut}>
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
                ? defDate
                : // moment(date).format('DD/MM/YYYY')
                  'DD/MM/YYYY'}
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
              {defTime.length > 0
                ? defTime
                : // moment(time).format('hh:mm a')
                  '00:00'}
            </Text>
          </Pressable>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={dtType}
          date={
            dtType === 'date'
              ? // date:time
                defDate.length > 0
                ? moment(defDate, 'DD/MM/YYYY').toDate()
                : date
              : defTime.length > 0
              ? moment(defTime, 'hh:mm a').toDate()
              : time
          }
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </Animated.View>
    );
  },
);

const LocationCompo = memo(
  ({
    locationData,
    updateLocation,
  }: {
    locationData: {location: string; isOnline: boolean};
    updateLocation: (val: string, isOn: boolean) => void;
  }) => {
    const [value, setValue] = useState(locationData.location);
    const [online, setOnline] = useState(locationData.isOnline);
    return (
      <Animated.View
        style={{
          gap: GapTwo,
        }}
        entering={FadeIn.delay(700)}
        exiting={FadeOut}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text variant={'BodyRegular'} style={[styles.color_W]}>
            {online ? 'Link URL' : 'Location'}
          </Text>
          <Pressable
            onPress={() => {
              setOnline(pre => {
                updateLocation(value, !pre);
                return !pre;
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <CustomCheckBox
              checked={online}
              height={20}
              width={20}
              checkMarkColor={'#fff'}
              checkedBorderColor={'#fff'}
              unCheckedBorderColor={'#fff'}
              checkedBackgroundColor={'#fff'}
              unCheckedBackgroundColor={'#fff'}
              duration={300}
            />
            <Text variant={'BodyRegular'} style={styles.color_W}>
              Online
            </Text>
          </Pressable>
        </View>
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
        {/* <View
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
        </View> */}
      </Animated.View>
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

    setProfileData({
      pic: tempPic ? tempPic : '',
      name: tempName ? tempName : '',
    });
  }, []);

  return (
    <Animated.View
      entering={FadeIn.delay(800)}
      exiting={FadeOut}
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
        {/* {data.pic.length > 0 && ( */}
          <Image
            source={{
              uri: data.pic
                ? data.pic
                : `https://avatar.iran.liara.run/username?username=${data.name.replaceAll(
                    ' ',
                    '+',
                  )}`,
            }}
            style={{
              width: 21,
              height: 21,
              borderRadius: 100,
            }}
          />
        {/* )} */}
        <Text variant={'BodyBold'} style={{color: '#fff'}}>
          {data.name}
        </Text>
      </View>
      <Pressable
        onPress={() => {
          ToastAndroid.showWithGravity(
            'Coming Soon',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }}
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
      </Pressable>
    </Animated.View>
  );
});

const EventDiscCompo = memo(
  ({setDisc, disc}: {setDisc: (val: string) => void; disc: string}) => {
    const [value, setValue] = useState(disc);
    return (
      <Animated.View
        style={{
          gap: GapTwo,
        }}
        entering={FadeIn.delay(900)}
        exiting={FadeOut}>
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
      </Animated.View>
    );
  },
);

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
      <Animated.View
        style={styles.viewSty}
        entering={FadeIn.delay(1000)}
        exiting={FadeOut}>
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
            key={0}
            android_ripple={{color: `#ffffff80`, borderless: false}}
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
              key={idx + 1}
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
      </Animated.View>
    );
  },
);
const GalleryItem = memo(
  ({uri, removeImg}: {uri: string; removeImg: () => void}) => {
    const [delStatus, setDelStatus] = useState(false);

    return (
      <AnimatedPressable
        entering={ZoomIn}
        exiting={ZoomOut}
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
      </AnimatedPressable>
    );
  },
);
const IconSize = width * 0.15;
const RSVPCompo = memo(
  ({
    rsvpStatus,
    onPress,
  }: {
    rsvpStatus: 'Y' | 'N' | 'M' | '' | null;
    onPress: (val: 'Y' | 'N' | 'M') => void;
  }) => {
    const [value, setValue] = useState(rsvpStatus);
    return (
      <Animated.View
        entering={FadeIn.delay(1100)}
        exiting={FadeOut}
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
          <RSVPcompoItem
            onPress={() => {
              onPress('Y');
              setValue('Y');
            }}
            icon="Y"
            selected={value === 'Y'}
            lable={'Going'}
          />
          <RSVPcompoItem
            onPress={() => {
              onPress('M');
              setValue('M');
            }}
            icon="M"
            selected={value === 'M'}
            lable={'May be'}
          />
          <RSVPcompoItem
            onPress={() => {
              onPress('N');
              setValue('N');
            }}
            icon="N"
            selected={value === 'N'}
            lable={'No'}
          />
        </View>
      </Animated.View>
    );
  },
);
const RSVPcompoItem = ({
  selected,
  icon,
  lable,
  onPress,
}: {
  selected: boolean;
  icon: string;
  lable: string;
  onPress: () => void;
}) => {
  const buttState = useAnimationState({
    from: {
      scale: 0.95,
    },
    to: {
      scale: 1,
    },
    pressd: {scale: 1.05},
  });
  return (
    <Pressable
      style={{
        flex: 1,
      }}
      onPress={onPress}
      onPressIn={() => buttState.transitionTo('pressd')}
      onPressOut={() => buttState.transitionTo('to')}>
      <MotiView
        style={{
          alignItems: 'center',
          gap: 12,
        }}
        state={buttState}>
        <RSVPIconCompo
          fill={selected ? '#FFF' : '#C5B1C3'}
          icon={icon}
          size={IconSize}
        />
        <Text
          variant={selected ? 'SubTitleTwo' : 'BodyRegular'}
          style={[
            styles.color_W,
            {
              lineHeight: 24,
            },
          ]}>
          {lable}
        </Text>
      </MotiView>
    </Pressable>
  );
};
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
