import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Pressable,
  StatusBar,
  View,
} from 'react-native';
import {BGline} from '../../assets/SVG/VectorSVG';
import HeaderCompo from '../../components/HeaderCompo';
import Text from '../../components/Text';
import {BinSVG, TickSVG} from '../../assets/SVG/IconsSVG';
import Contacts from 'react-native-contacts';
import Button from '../../components/Button';
import LoadingCompo from '../../components/LoadingCompo';
import PopupCompo from '../../components/PopupCompo';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {
  contactType,
  errorType,
  importContactForm,
  importContactResponse,
} from './contactsType';
import Urls from '../../api/urls';
import {postData} from '../../api';
import {MainStackNavigation, RootStackParamList} from '../../navigation';
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import ContsctsList from './ContsctsList';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  FadeOutDown,
  FadeOutLeft,
  FadeOutRight,
} from 'react-native-reanimated';
import {Tooltip} from 'react-native-paper';
import TextInput from '../../components/TextInput';
import {debounce} from 'lodash';
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
type Item = {
  id: string;
  name: string;
  number: string;
};

type ListViewWithCheckboxProps = {
  data: Item[];
};
export default function () {
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
              gap: 10,
            }}>
            <Text
              variant={'TitleTwo'}
              style={{
                color: '#fff',
              }}
              entering={FadeIn}
              exiting={FadeOut}>
              Guests from contacts
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
          <ContactsCompo />
        </View>
      </View>
    </View>
  );
}

export type contactListItem = contactType;

export type ItemType = Record<string, {name: string; number: string}>;
const ContactsCompo = memo(() => {
  const {params} = useRoute<RouteProp<RootStackParamList, 'ImportContacts'>>();

  const navigation = useNavigation<MainStackNavigation>();

  const [contacts, setContacts] = useState<contactListItem[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const [selectedItems, setSelectedItems] = useState<ItemType>({}); // Object to store selected items

  //

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  //

  // getting the data
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionGranted(true);
          fetchContacts();
        } else {
        }
      } else {
        fetchContacts();
      }
    };

    requestPermission();
  }, []);

  const fetchContacts = () => {
    setLoading({
      status: true,
      text: `Getting Contacts...`,
    });
    Contacts.getAll()
      .then(contacts => {
        let formattedContacts: contactListItem[] = [];
        contacts.map(contact => {
          contact.phoneNumbers.map(itm => {
            formattedContacts = [
              ...formattedContacts,
              {
                id: `${contact.recordID}${itm.number}`,
                name: contact.displayName,
                number: itm.number.replace(/[+\s]+/g, ''),
                pic: null,
              },
            ];
          });
          //
        });
        let newformattedContacts = formattedContacts
          .filter(
            (item, index) =>
              formattedContacts.findIndex(itm => itm.number === item.number) ===
                index &&
              item.number.length > 5 &&
              item.name.length > 0,
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setContacts(newformattedContacts);
        setLoading({
          status: false,
          text: `Getting Contacts...`,
        });
      })
      .catch(error => {});
  };

  // upload data
  const [loading, setLoading] = useState({
    status: false,
    text: '',
  });

  //
  const [popupModal, setPopupModal] = useState(PopupModal);

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

  const onSubmitData = useCallback(() => {
    const selectedItms = Object.values(selectedItems);
    if (selectedItms.length > 0) {
      const adjustData = selectedItms.map(itm => ({...itm, country_code: ''}));
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
  }, [selectedItems]);

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

  const [value, setValue] = useState('');
  const [viewAll, setViewAll] = useState(true);

  // Debounce the search input to optimize performance
  const debouncedSetValue = useCallback(debounce(setValue, 300), []);

  // Memoize the filtered contacts list
  const filteredContacts = useMemo(() => {
    return contacts.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
  }, [contacts, value]);

  // Memoize the selected contacts list
  const selectedContacts = useMemo(() => {
    return Object.values(selectedItems)
      .map((itm, id) => ({
        ...itm,
        id,
      }))
      .filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
  }, [selectedItems, value]);

  return (
    <View
      style={{
        // borderWidth: 1,
        flex: 1,
      }}>
      <View
        style={{
          gap: 20,
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            //   marginVertical: 12,
          }}>
          <Text
            style={{color: '#fff'}}
            variant={'SubTitleTwo'}
            entering={FadeInLeft.delay(200)}
            exiting={FadeOutLeft}>
            Edit your guest list below
          </Text>
          {/* <AnimatedPressable
              entering={FadeInRight.delay(200)}
              exiting={FadeOutRight}
              onPress={()=>{

              }}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 10,
                backgroundColor: '#C71D40',
              }}>
              <BinSVG fill={'#fff'} width={14} height={14} />
            </AnimatedPressable> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <TextInput
              iconName="search"
              onChangeText={debouncedSetValue}
              iconsize={16}
              textInputStyle={{
                fontFamily: 'PoppinsMedium',
                fontWeight: '500',
                letterSpacing: 0,
                fontSize: 14,
                lineHeight: 18.2,
                paddingVertical: 6,
              }}
              textInputProps={{
                placeholder: 'Find a guest....',
                placeholderTextColor: '#ffffff80',
                returnKeyType: 'search',
              }}
              onRightButt={() => {
                setValue('');
              }}
            />
          </View>
          <View>
            <Button
              onPress={() => setViewAll(pre => !pre)}
              lable={viewAll ? 'Selected' : 'All'}
              buttonStyles={{
                // width: width * 0.42,
                backgroundColor: '#FFFFFF80',
                borderColor: '#EDEDED',
                borderWidth: 1,
                paddingVertical: 12,
                minWidth: 100,
                width: 'auto',
              }}
              variant="BodyRegular"
            />
          </View>
        </View>
        {contacts.length > 0 && (
          <>
            {viewAll ? (
              <ContsctsList
                key="all"
                staticData={false}
                selectedItems={selectedItems}
                setSelectedItems={(val: any) => setSelectedItems(val)}
                contacts={filteredContacts}
                delay={0}
              />
            ) : (
              <ContsctsList
                key="selected"
                staticData={true}
                selectedItems={selectedItems}
                setSelectedItems={(val: any) => setSelectedItems(val)}
                contacts={selectedContacts}
                delay={0}
              />
            )}
          </>
        )}
      </View>

      {contacts.length > 0 && !isKeyboardVisible && (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutDown}
          style={{paddingVertical: height * 0.01, gap: height * 0.01}}>
          <Tooltip
            enterTouchDelay={0}
            title={Object.values(selectedItems)
              .map(item => item.name)
              .join(', ')}>
            <Text style={{color: '#fff'}} variant={'BodyRegular'}>
              {Object.values(selectedItems).length} Selected
            </Text>
          </Tooltip>

          <Button
            lable="ADD TO LIST"
            textStyles={{
              color: '#2D2D2D',
            }}
            buttonStyles={{
              backgroundColor: '#F9BC52',
              borderRadius: 10,
              width: '100%',
            }}
            onPress={() => {
              onSubmitData();
            }}
          />
        </Animated.View>
      )}
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
    </View>
  );
});
