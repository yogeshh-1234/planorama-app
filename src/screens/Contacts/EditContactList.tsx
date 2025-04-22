import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, StatusBar, TextInput, View } from 'react-native';
import { BGline } from '../../assets/SVG/VectorSVG';
import HeaderCompo from '../../components/HeaderCompo';
import Text from '../../components/Text';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { FlashList } from '@shopify/flash-list';
import Button from '../../components/Button';
import { storage } from '../../functions/storage';
import { useMutation } from '@tanstack/react-query';
import { postData } from '../../api';
import Urls from '../../api/urls';
import { errorType, importContactForm, importContactResponse } from './contactsType';

const { width, height } = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

export default function () {
  const { params } = useRoute<RouteProp<RootStackParamList, 'EditContactList'>>();
  // const [contList, setContList] = useState(params.data);
  const [finalList, setFinalList] = useState<{ name: string; number: string }[]>(
    [],
  );
  const [loading, setLoading] = useState({
    status: false,
    text: '',
  });

  useEffect(() => {
    setFinalList(params.data);
  }, [params.data]);




  const onSubmit = () => {
    const adjustData = finalList.map(itm => ({ ...itm, country_code: '' }));
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
          contacts: JSON.stringify(adjustData),
        };
        setLoading({
          status: true,
          text: `Uploading ${adjustData.length} Contacts...`,
        });

        mutation.mutate(formData);
      }
  }


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













  const renderItem = ({
    item,
    index,
  }: {
    item: { name: string; number: string };
    index: number;
  }) => {
    return (
      <RenderItem
        name={item.name}
        number={item.number}
        index={index}
        //   setFinalList={setFinalList}
        handleNameChange={(text: string) => {
          console.log('text', text, index);
          setFinalList(pre => {
            const updatedList = pre.map((item, i) =>
              i === index ? { ...item, name: text } : item,
            );
            console.log(updatedList);
            return updatedList;
          });
        }}
        handleNumberChange={(text: string) => {
          setFinalList(pre => {
            const updatedList = pre.map((item, i) =>
              i === index ? { ...item, number: text } : item,
            );
            console.log(updatedList);
            return updatedList;
          });


          // setFinalList(pre => {
          //   let updatedList = [...pre];
          //   updatedList[index].number = text;
          //   return updatedList;
          // });
        }}
      />
    );
  };

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
      <View
        style={{
          flex: 1,
          gap: 21,
        }}>
        <View
          style={{
            gap: 10,
            paddingHorizontal: width * 0.05,
          }}>
          <Text
            variant={'TitleTwo'}
            style={{
              color: '#fff',
            }}
            entering={FadeIn}
            exiting={FadeOut}>
            Confirm New Guests
          </Text>
          <Text
            variant={'BodyRegular'}
            style={{
              color: '#fff',
            }}
            entering={FadeIn.delay(100)}
            exiting={FadeOut}>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint.
          </Text>
        </View>

        <FlatList
          data={finalList}
          renderItem={renderItem}
          keyExtractor={item => item.number}
          //   estimatedItemSize={50}
          contentContainerStyle={{
            paddingHorizontal: width * 0.05,
          }}
          ListHeaderComponent={HeaderItem}
        //   extraData={finalList}
        />

        <Button
          lable="ADD TO LIST"
          textStyles={{
            color: '#2D2D2D',
          }}
          buttonStyles={{
            backgroundColor: '#F9BC52',
            borderRadius: 10,
            width: '90%',
            alignSelf: 'center',
          }}
          onPress={() => {
            console.log('Updated finalList:', finalList);
          }}
        />
      </View>
    </View>
  );
}
const HeaderItem = () => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 2,
      paddingHorizontal: 8,
      backgroundColor: '#C5B1C326',
      gap: 10,
    }}>
    <View
      style={{
        borderColor: '#fff',
        // borderWidth: staticData || fromGuest ? 0 : 0.5,
        borderRadius: 5,
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 4,
      }}>
      <Text variant={'BodyBold'} style={{ color: '#fff' }}>
        Addressable Name
      </Text>
    </View>
    <Text variant={'BodyBold'} style={{ color: '#fff', flex: 1 }}>
      Mobile number
    </Text>
  </View>
);
const RenderItem = ({
  name,
  number,
  index,
  handleNameChange,
  handleNumberChange,
}: {
  name: string;
  number: string;
  index: number;
  handleNameChange: (val: string) => void;
  handleNumberChange: (val: string) => void;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 8,
        backgroundColor: index % 2 ? '#C5B1C326' : '#75486F',
        gap: 10,
      }}>
      <TextInput
        style={{
          borderWidth: 0.5,
          borderColor: '#fff',
          borderRadius: 5,
          paddingVertical: 0,
          flex: 1,
        }}
        defaultValue={name}
        onChangeText={handleNameChange}
      />
      <TextInput
        style={{
          borderWidth: 0.5,
          borderColor: '#fff',
          borderRadius: 5,
          paddingVertical: 0,
          flex: 1,
        }}
        keyboardType="phone-pad"
        enterKeyHint="done"
        dataDetectorTypes={'phoneNumber'}
        defaultValue={number}
        onChangeText={handleNumberChange}
      />
    </View>
  );
};
