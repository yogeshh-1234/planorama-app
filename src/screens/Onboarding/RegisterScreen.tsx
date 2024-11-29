import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  View,
} from 'react-native';
import Text from '../../components/Text';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import {ImageSVG} from '../../assets/SVG/IconsSVG';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {AuthSuccess, ErrorFormat, registerFormType} from './authType';
import Urls from '../../api/urls';
import {postData} from '../../api';
import PopupCompo from '../../components/PopupCompo';

const {width, height} = Dimensions.get('screen');
const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
export default function () {
  const [name, setName] = useState('');
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popupModal, setPopupModal] = useState(PopupModal);
  const [imageUri, setImageUri] = useState<string | null>(null);
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
                includeBase64: true,
              },
              response => {
                if (response.didCancel) {
                  // console.log('User cancelled image capture');
                } else if (response.errorCode) {
                  console.error('Camera Error:', response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                  setImageUri(response.assets[0].base64 || null);
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
                includeBase64: true,
              },
              response => {
                if (response.didCancel) {
                  // console.log('User cancelled image picker');
                } else if (response.errorCode) {
                  console.error('Gallery Error:', response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                  setImageUri(response.assets[0].base64 || null);
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

  const registerFn = () => {
    Keyboard.dismiss();

    //
    let mobile = '';
    const tempNum = storage.getString('phone.number');
    if (tempNum !== null && tempNum !== undefined) {
      mobile = tempNum;
    }
    //
    if (imageUri === null) {
      return;
    }

    const formData = {
      mode: 'REGISTER',
      mobile: mobile,
      name: name,
      pic: imageUri,
    };
    setLoading(true);

    mutation.mutate(formData);
  };
  const mutation = useMutation<AuthSuccess, ErrorFormat, registerFormType>({
    mutationFn: (formData: registerFormType) =>
      postData<registerFormType, AuthSuccess>(Urls.AUTH, formData),
    onSuccess: data => {
      if (data.StatusCode === 200) {
        //  register
        storage.set('user.token', data.data.token);
        storage.set('user.id', data.data.id);
      } else {
        setPopupModal({
          state: true,
          title: `Oops! Something went wrong.${
            data.StatusCode ? ` [${data.StatusCode}]` : ''
          }`,
          disc: "We couldn't complete your request, please try again!",
          buttOne: '',
          buttTwo: 'OKAY',
        });
      }
      setLoading(false);
    },
    onError: error => {
      setLoading(false);
      setPopupModal({
        state: true,
        title: `Oops! Something went wrong.${
          error?.StatusCode ? ` [${error.StatusCode}]` : ''
        }`,
        disc: error?.error?.description
          ? error.error.description
          : "We couldn't complete your request, please try again!",
        buttOne: '',
        buttTwo: 'OKAY',
      });
    },
  });

  const onDismiss = useCallback(
    () => setPopupModal({...popupModal, state: false}),
    [],
  );
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: width * 0.05,
        justifyContent: 'space-between',
      }}>
      <Text variant={'Heading'} style={{color: '#fff', textAlign: 'center'}}>
        Enter your details
      </Text>

      <View>
        <Pressable
          style={{
            alignSelf: 'center',
            backgroundColor: '#C5B1C380',
            borderRadius: 200,
            height: 200,
            width: 200,
            gap: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={handleUploadImage}>
          {imageUri ? (
            <Image
              source={{uri: imageUri}}
              style={{
                width: 200,
                height: 200,
                borderRadius: 200,
                borderWidth: 2,
                borderColor: '#C5B1C380',
              }}
            />
          ) : (
            <>
              <ImageSVG width={40} height={40} />
              <Text
                variant={'BodyRegular'}
                style={{color: '#fff', textAlign: 'center'}}>
                Upload image
              </Text>
            </>
          )}
        </Pressable>
      </View>
      <View style={{gap: height * 0.01}}>
        <Text style={{color: '#fff'}} variant={'BodyRegular'}>
          Display name*
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          textInputProps={{
            keyboardType: 'default',
            returnKeyType: 'done',
            dataDetectorTypes: 'all',
          }}
          textInputStyle={{
            paddingHorizontal: 12,
          }}
        />
      </View>
      <Button lable="CONTINUE" onPress={registerFn} loading={loading} />

      <View />
      <View />
      <View />
      <View />
      <PopupCompo
        isVisible={popupModal.state}
        onDismiss={onDismiss}
        title={popupModal.title}
        disc={popupModal.disc}
        buttOne={popupModal.buttOne}
        buttTwo={popupModal.buttTwo}
        buttOnePress={onDismiss}
        buttTwoPress={onDismiss}
      />
    </View>
  );
}
