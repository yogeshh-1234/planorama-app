import React, {memo, useCallback, useEffect, useState} from 'react';
import {Dimensions, Pressable, ScrollView, View} from 'react-native';
import TextInput from '../../components/TextInput';
import {GuestEventResponseData, guestItemType} from './EventGuestType';
import Text from '../../components/Text';
import {SendSVG, WASVG} from '../../assets/SVG/IconsSVG';
import {MotiView, useAnimationState} from 'moti';
import ContsctsList from '../Contacts/ContsctsList';
import {ItemType} from '../Contacts/ContactsScreen';
import Button from '../../components/Button';
import PopupCompo from '../../components/PopupCompo';
import LoadingCompo from '../../components/LoadingCompo';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {postData} from '../../api';
import Urls from '../../api/urls';
import RSVPIconCompo from '../../components/RSVPIconCompo';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation, guestListType} from '../../navigation';
import {
  connectionForm,
  connectionResponce,
  profileError,
} from '../Profile/ProfileTypes';
import {
  errorType,
  importContactResponse,
  importGuestForm,
} from '../Contacts/contactsType';
const {width, height} = Dimensions.get('screen');
type filterType = '' | 'Y' | 'N' | 'M';
const paddingHorizontal = width * 0.05;

const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
type filterArrType = {
  all: guestItemType[];
  going: guestItemType[];
  maybe: guestItemType[];
  no: guestItemType[];
};
export default function ({
  eventID,
  onReload,
  eventName,
  eventPic,
  allGuestData,
}: {
  eventID: number;
  onReload: () => void;
  eventName: string;
  eventPic: string;
  allGuestData: GuestEventResponseData;
}) {
  // console.log('allGuestData', allGuestData);
  const navigation = useNavigation<MainStackNavigation>();

  const [value, setValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [selectedItems, setSelectedItems] = useState<ItemType>({}); // Object to store selected items

  const [loading, setLoading] = useState({
    status: false,
    text: '',
  });

  const [status, setStatus] = useState(false);
  const [popupModal, setPopupModal] = useState(PopupModal);

  const onDismiss = useCallback(() => {
    setPopupModal({...popupModal, state: false});
  }, [popupModal.state]);

  const buttOnePress = useCallback(() => {
    setPopupModal({...popupModal, state: false});
  }, [popupModal.state]);

  const buttTwoPress = useCallback(() => {
    setPopupModal({...popupModal, state: false});
  }, [popupModal.state]);
  useEffect(() => {
    checkWhatsappStatus();
  }, []);
  const checkWhatsappStatus = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (token && id) {
      const formData = {
        mode: 'CHECK_CONNECTION',
        token,
        id,
      };
      setLoading({
        status: true,
        text: 'Checking whatsapp connection',
      });
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<
    connectionResponce,
    profileError,
    connectionForm
  >({
    mutationFn: (formData: connectionForm) =>
      postData<connectionForm, connectionResponce>(Urls.WHATSAPP, formData),
    onSuccess: ({data: {status}, StatusCode}) => {
      StatusCode === 200
        ? setStatus(status)
        : errorPopUp(StatusCode, null, 'BACK');
      setLoading({
        status: false,
        text: '',
      });
    },
    onError: error =>
      errorPopUp(error?.StatusCode, error?.error?.description, 'BACK'),
  });

  const errorPopUp = (code: number, desc: string | null, buttTxt: string) => {
    setLoading({
      status: false,
      text: '',
    });
    setPopupModal({
      state: true,
      title: `Oops! Something went wrong.${code ? ` [${code}]` : ''}`,
      disc: desc
        ? desc
        : "We couldn't complete your request, please try again!",
      buttOne: '',
      buttTwo: 'OKAY',
    });
  };

  const onSendMsg = () => {
    let guestList: guestListType[] = [];
    Object.keys(selectedItems).forEach(function (key, index) {
      guestList = [
        ...guestList,
        {
          ...selectedItems[key],
          id: key,
        },
      ];
    });

    navigation.navigate('SendMsgScreen', {
      guestList,
      eventID,
      eventName,
      eventPic,
    });
  };

  const onDelete = () => {
    const selectedItms = Object.keys(selectedItems).map(itm => parseInt(itm));
    if (selectedItms.length > 0) {
      const token = storage.getString('user.token');
      const id = storage.getString('user.id');
      if (
        token !== null &&
        token !== undefined &&
        id !== null &&
        id !== undefined
      ) {
        const formData = {
          mode: 'DELETE_GUESTS',
          token,
          id,
          event_id: eventID,
          guests_ids: JSON.stringify(selectedItms),
        };

        setLoading({
          status: true,
          text: `Removing ${selectedItms.length} Contacts...`,
        });
        delGuestMutation.mutate(formData);
      }
    }
  };

  const delGuestMutation = useMutation<
    importContactResponse,
    errorType,
    importGuestForm
  >({
    mutationFn: (formData: importGuestForm) =>
      postData<importGuestForm, importContactResponse>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        //
        setSelectedItems({});
        onReload();
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
        gap: 24,
      }}>
      <View
        style={{
          paddingHorizontal,
        }}>
        <TextInput
          iconName="search"
          value={value}
          onChangeText={setValue}
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
        <FilterRow
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          guestCount={allGuestData.rsvp_cnt}
          guestCountNames={allGuestData.INVITE_RSVP_DD_ARR}
        />
      </View>
      <View
        style={{
          paddingHorizontal,
          flex: 1,
        }}>
        <ContsctsList
          staticData={false}
          selectedItems={selectedItems}
          setSelectedItems={(val: any) => setSelectedItems(val)}
          contacts={allGuestData.guest_list.filter(item =>
            selectedFilter === 'ALL'
              ? true
              : item.rsvp === selectedFilter &&
                item.name.toLowerCase().includes(value.toLowerCase()),
          )}
          fromGuest={true}
          eventID={eventID}
          onReload={onReload}
          onDelete={onDelete}
          rsvpArray={allGuestData.INVITE_RSVP_DD_ARR}
        />
   
      </View>
      <View style={{alignSelf: 'center', paddingBottom: 12}}>
        {status ? (
          <Button
            lable="SEND MESSAGE"
            variant="SubTitleTwo"
            textStyles={{
              color: '#2D2D2D',
            }}
            buttonStyles={{
              backgroundColor:
                Object.keys(selectedItems).length !== 0
                  ? '#F9BC52'
                  : '#F9BC5280',
            }}
            icon={() => <SendSVG fill={'#2D2D2D'} width={20} height={20} />}
            onPress={onSendMsg}
            small={true}
            disabled={Object.keys(selectedItems).length === 0}
          />
        ) : (
          <Button
            lable="Connect Your WhatsApp"
            variant="SubTitleTwo"
            textStyles={{
              color: '#fff',
            }}
            buttonStyles={{
              backgroundColor: '#2FAB68',
            }}
            onPress={() => {
              navigation.navigate('ProfileScreen');
            }}
            small={true}
            icon={() => <WASVG width={20} height={20} fill={'#fff'} />}
          />
        )}
      </View>
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
}
const FilterRow = memo(
  ({
    selectedFilter,
    setSelectedFilter,
    guestCount,
    guestCountNames,
  }: {
    selectedFilter: string;
    setSelectedFilter: (val: string) => void;
    guestCount: {
      [key: string]: number;
    };
    guestCountNames: Array<{
      id: string;
      name: string;
    }>;
  }) => {
    return (
      <ScrollView
        horizontal
        contentContainerStyle={{
          paddingHorizontal,
          gap: paddingHorizontal / 2,
        }}
        showsHorizontalScrollIndicator={false}>
        {guestCountNames.map((itm, idx) => {
          return (
            (guestCount[itm.id] > 0 || guestCount[itm.id] === 'ALL') && (
              <FilterItem
                title={itm.name}
                count={guestCount[itm.id]}
                icon={itm.id}
                selected={selectedFilter === itm.id}
                onPress={() => {
                  setSelectedFilter(itm.id);
                }}
              />
            )
          );
        })}
        {/* <FilterItem
          title="All"
          count={guestListArr.all}
          icon=""
          selected={selectedFilter === ''}
          onPress={() => {
            setSelectedFilter('');
          }}
        />
        <FilterItem
          title="Going"
          count={guestListArr.go}
          icon="Y"
          selected={selectedFilter === 'Y'}
          onPress={() => {
            setSelectedFilter('Y');
          }}
        />
        <FilterItem
          title="May be"
          count={guestListArr.maybe}
          icon="M"
          selected={selectedFilter === 'M'}
          onPress={() => {
            setSelectedFilter('M');
          }}
        />
        <FilterItem
          title="No"
          count={guestListArr.no}
          icon="N"
          selected={selectedFilter === 'N'}
          onPress={() => {
            setSelectedFilter('N');
          }}
        /> */}
      </ScrollView>
    );
  },
);
const FilterItem = ({
  title,
  count,
  icon,
  selected,
  onPress,
}: {
  title: string;
  count: number;
  icon: string;
  selected: boolean;
  onPress: () => void;
}) => {
  const buttState = useAnimationState({
    from: {
      scale: 1,
    },
    to: {
      scale: 1,
    },
    pressd: {scale: 0.95},
  });
  return (
    <Pressable
      onPressIn={() => buttState.transitionTo('pressd')}
      onPressOut={() => buttState.transitionTo('to')}
      onPress={onPress}>
      <MotiView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: '#C5B1C33D',
          borderRadius: 100,
          borderWidth: 1,
          borderColor: selected ? '#fff' : 'transparent',
        }}
        state={buttState}>
        <RSVPIconCompo icon={icon} size={20} />
        <Text
          variant={'BodyRegular'}
          style={{
            color: '#fff',
          }}>
          {title}
        </Text>
        <Text
          variant={'BodyRegular'}
          style={{
            color: '#ffffff80',
          }}>
          {count}
        </Text>
      </MotiView>
    </Pressable>
  );
};
