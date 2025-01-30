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
  const [imageUri, setImageUri] = useState<{
    base64: string | undefined;
    path: string | undefined;
  }>({
    base64: '',
    path: '',
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
                // console.log(response);
                if (response.didCancel) {
                  // console.log('User cancelled image capture');
                } else if (response.errorCode) {
                  // console.log('Camera Error:', response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                  setImageUri({
                    base64: `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`,
                    path: response?.assets[0].uri,
                  });
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
                // console.log(response);
                if (response.didCancel) {
                  // console.log('User cancelled image picker');
                } else if (response.errorCode) {
                  // console.log('Gallery Error:', response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                  setImageUri({
                    base64: `data:${response?.assets[0].type};base64,${response?.assets[0].base64}`,
                    path: response?.assets[0].uri,
                  });
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
    if (imageUri.base64 === null || imageUri.base64 === undefined) {
      return;
    }

    let country_code = '';
    let tempCode = storage.getString('country.code');
    if (tempCode !== null && tempCode !== undefined) {
      country_code = tempCode;
    }
    const formData = {
      mode: 'REGISTER',
      mobile: mobile,
      name: name,
      pic: imageUri.base64,
      country_code,
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

        storage.set('user.id', data.data.id);
        storage.set('user.token', data.data.token);
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
          {imageUri?.path && imageUri?.path?.length > 0 ? (
            <Image
              source={{uri: imageUri.path}}
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
            color: '#fff',
          }}
        />
      </View>
      {/* name: name,
      pic: imageUri.base64, */}
      <Button
        lable="CONTINUE"
        onPress={registerFn}
        disabled={
          !(imageUri?.base64.length > 0 && name.length > 0)
        }
        loading={loading}
      />

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
