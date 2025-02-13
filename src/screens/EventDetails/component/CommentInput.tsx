import React, {useState} from 'react';
import {View, TextInput, Alert, Pressable, Image} from 'react-native';
import {CommentInputProps} from '../commenttypes';
import {HostedByCompo} from '../DetailsCompo';
import Button from '../../../components/Button';
import {ImgUploadSVG} from '../../../assets/SVG/IconsSVG';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Text from '../../../components/Text';

const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  isReply = false,
}) => {
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);

  const handleImagePicker = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      selectionLimit: 1,
      includeBase64: true,
      mediaType: 'photo' as const,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.errorCode) {
        // console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        // console.log(response.assets[0].base64);
        setImage(
          `data:${response?.assets[0].type};base64,${response?.assets[0].base64}` ||
            null,
        );
      }
    });
  };

  const handleSubmit = () => {
    if (!text && !image) {
      Alert.alert('Error', 'Please enter text or select an image');
      return;
    }
    onSubmit({text, image});
    setText('');
    setImage(null);
  };

  return isReply ? (
    <Pressable style={{paddingVertical: 4, marginLeft: 25}}>
      <Text variant={'DetailRegular'} style={{color: '#EDEDED'}}>
        Reply
      </Text>
    </Pressable>
  ) : (
    <View
      style={{
        backgroundColor: '#C5B1C33D',
        borderRadius: 10,
        padding: 12,
        gap: 8,
        marginTop: 12,
      }}>
      <HostedByCompo hostList={[]} />
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
        }}>
        <TextInput
          style={{
            backgroundColor: '#C5B1C33D',
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 0,
            height: 45,
            flex: 1,
            color: '#fff',
            fontFamily: 'PoppinsMedium',
            fontWeight: '500',
            letterSpacing: 0,
            fontSize: 14,
            lineHeight: 18.2,
          }}
          placeholder="Hey there!!!"
          value={text}
          onChangeText={setText}
          multiline
        />
        <Pressable
          style={{
            height: 45,
            width: 45,
            borderRadius: 10,
            backgroundColor: '#f1f1f1',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={handleImagePicker}>
          {image ? (
            <Image
              source={{uri: image}}
              style={{width: '100%', height: '100%', borderRadius: 10}}
              resizeMode="cover"
            />
          ) : (
            <ImgUploadSVG width={22} height={22} fill={'#212121'} />
          )}
        </Pressable>
      </View>
      <Button
        lable="Post"
        variant="DetailBold"
        textStyles={{
          color: '#2D2D2D',
        }}
        small
        buttonStyles={{
          width: 'auto',
          backgroundColor: '#fff',
          // height: 40,
        }}
        onPress={handleSubmit}
      />
      {/* {!isReply && (
        <Button title="Pick Image" onPress={handleImagePicker} />
      )}
      <TextInput
        placeholder={isReply ? 'Write a reply...' : 'Write a comment...'}
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button title={isReply ? 'Reply' : 'Comment'} onPress={handleSubmit} /> */}
    </View>
  );
};

export default CommentInput;
