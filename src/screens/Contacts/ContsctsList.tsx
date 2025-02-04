import React, {useCallback, useMemo, useState} from 'react';
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ToastAndroid,
  View,
} from 'react-native';
import {BinSVG, DownSVG, TickSVG} from '../../assets/SVG/IconsSVG';
import Text from '../../components/Text';
import {ItemType, contactListItem} from './ContactsScreen';
import RSVPIconCompo from '../../components/RSVPIconCompo';
import Animated, {
  FadeInLeft,
  FadeOutLeft,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {ActivityIndicator, Menu} from 'react-native-paper';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {importContactResponse, rsvpSubmitForm} from './contactsType';
import {postData} from '../../api';
import Urls from '../../api/urls';
import {ErrorFormat} from '../Onboarding/authType';
import {FlashList} from '@shopify/flash-list';
import ImageIcon from '../../components/ImageIcon';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const {width, height} = Dimensions.get('screen');
export default function ({
  staticData,
  selectedItems,
  setSelectedItems,
  contacts,
  fromGuest = false,
  delay = 0,
  eventID,
  onReload,
  onDelete,
}: {
  staticData: boolean;
  selectedItems: ItemType;
  setSelectedItems: (val: ((data: ItemType) => void) | ItemType) => void;
  contacts: contactListItem[];
  fromGuest?: boolean;
  delay?: number;
  eventID?: number;
  onReload?: () => void;
  onDelete?: () => void;
}) {
  const [selectAll, setSelectAll] = useState(false);

  // data logic
  const handleSelectItem = useCallback(
    (id: string, name: string, number: string, isChecked: boolean) => {
      setSelectedItems(prev => {
        const updated = {...prev};
        if (isChecked) {
          updated[id] = {
            name,
            number,
          };
        } else {
          delete updated[id];
        }
        return updated;
      });
    },
    [],
  );

  const handleSelectAll = useCallback(() => {
    setSelectedItems(prev => {
      if (!selectAll) {
        const allSelected = contacts.reduce((acc, item) => {
          acc[item.id] = {
            name: item.name,
            number: item.number,
          };
          return acc;
        }, {} as Record<string, {name: string; number: string}>);
        return allSelected;
      } else {
        return {};
      }
    });
    setSelectAll(!selectAll);
  }, [contacts, selectAll]);

  const imgSize = fromGuest ? width * 0.08 : width * 0.07;

  const renderItem = useCallback(
    ({item, index}: {item: contactListItem; index: number}) => {
      const isChecked = !!selectedItems[item.id];
      return (
        <AnimatedPressable
          entering={FadeInLeft.delay(delay + (index + 1) * 50)}
          exiting={FadeOutLeft}
          onPress={
            staticData || fromGuest
              ? null
              : () => {
                  handleSelectItem(
                    item.id.toString(),
                    item.name,
                    item.number,
                    !isChecked,
                  );
                }
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 2,
            paddingHorizontal: 8,
            backgroundColor: fromGuest
              ? 'transparent'
              : staticData
              ? '#75486F'
              : index % 2
              ? '#C5B1C326'
              : '#75486F',
            gap: 10,
          }}>
          {!staticData && (
            <Pressable
              onPress={() => {
                handleSelectItem(
                  item.id.toString(),
                  item.name,
                  item.number,
                  !isChecked,
                );
              }}
              style={{
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#fff',
              }}>
              {isChecked && <TickSVG width={12} height={12} />}
            </Pressable>
          )}
          {(staticData || fromGuest) && (
            <View
              style={{
                marginVertical: 4,
              }}>
              <Animated.Image
                entering={ZoomIn}
                exiting={ZoomOut}
                source={{
                  uri: item.pic
                    ? item.pic
                    : `https://avatar.iran.liara.run/username?username=${item.name.replaceAll(
                        ' ',
                        '+',
                      )}`,
                }}
                style={{
                  width: imgSize,
                  height: imgSize,
                  borderRadius: imgSize,
                }}
              />
            </View>
          )}

          <View
            style={{
              borderColor: '#fff',
              borderWidth: staticData || fromGuest ? 0 : 0.5,
              borderRadius: 5,
              flex: 1,
              paddingVertical: 6,
              paddingHorizontal: 4,
            }}>
            <Text
              variant={staticData ? 'DetailBold' : 'BodyRegular'}
              style={{color: '#fff'}}>
              {item.name}
            </Text>
          </View>
          {!fromGuest && (
            <Text variant={'BodyRegular'} style={{color: '#fff', flex: 1}}>
              {item.number}
            </Text>
          )}

          {fromGuest && item.rsvp !== undefined && item.rsvp !== null && (
            <RSVPCompo
              rsvp={item.rsvp}
              event_id={eventID ? eventID : -1}
              guest_id={
                typeof item.id === 'number' ? item.id : parseInt(item.id)
              }
            />
          )}
        </AnimatedPressable>
      );
    },
    [selectedItems, handleSelectItem],
  );

  const memoizedData = useMemo(() => contacts, [contacts]);
  return (
    <View
      style={{
        flex: 1,
        gap: fromGuest ? 6 : 0,
      }}>
      {!staticData && memoizedData.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <AnimatedPressable
            entering={FadeInLeft.delay(delay)}
            exiting={FadeOutLeft}
            onPress={handleSelectAll}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 2,
              paddingHorizontal: 8,
              backgroundColor: fromGuest ? 'transparent' : '#C5B1C326',
              gap: 10,
              flex: 1,
            }}>
            <View
              style={{
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: staticData ? 0 : 1,
                borderColor: '#fff',
              }}>
              {selectAll && <TickSVG width={12} height={12} />}
            </View>
            {fromGuest ? (
              <>
                <Text
                  variant={'DetailRegular'}
                  style={{color: '#fff', flex: 1}}>
                  Select all
                </Text>
              </>
            ) : (
              <>
                <View
                  style={{
                    borderColor: '#fff',
                    borderWidth: 0,
                    borderRadius: 5,
                    flex: 1,
                    paddingVertical: 6,
                    paddingHorizontal: 4,
                  }}>
                  <Text variant={'BodyRegular'} style={{color: '#fff'}}>
                    Name
                  </Text>
                </View>
                <Text variant={'BodyRegular'} style={{color: '#fff', flex: 1}}>
                  Mobile Number
                </Text>
              </>
            )}
          </AnimatedPressable>
          {fromGuest && (
            <Pressable onPress={onDelete} style={{padding: 12}}>
              <BinSVG width={16} height={16} fill={'#fff'} />
            </Pressable>
          )}
        </View>
      )}
      <View
        style={{
          flex: 1,
        }}>
        <FlashList
          data={memoizedData}
          renderItem={renderItem}
          extraData={selectedItems}
          keyExtractor={item => item.id.toString()}
          estimatedItemSize={50}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={onReload}
              title="Pull to refresh"
              colors={['#F2F2F2']}
              progressBackgroundColor={'#0E0E0E'}
              titleColor="grey"
            />
          }
        />
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
const RSVPCompo = ({
  rsvp,
  event_id,
  guest_id,
}: {
  rsvp: string;
  event_id: number;
  guest_id: number;
}) => {
  const [visible, setVisible] = React.useState(false);

  const [rsvpState, setRsvpState] = useState(rsvp);
  const [tempVal, settempVal] = useState('');

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  //
  //

  const [loading, setLoading] = useState(false);

  const selectRSVP = (sel: string) => {
    settempVal(sel);
    closeMenu();
    callAPI(sel);
  };

  const callAPI = (rsvpVal: string) => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        mode: 'UPDATE_GUESTS_RSVP',
        token,
        id,
        event_id,
        guest_id,
        rsvp: rsvpVal,
      };
      setLoading(true);
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<
    importContactResponse,
    ErrorFormat,
    rsvpSubmitForm
  >({
    mutationFn: (formData: rsvpSubmitForm) =>
      postData<rsvpSubmitForm, importContactResponse>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      StatusCode === 200 ? setData() : errorPopUp(StatusCode, null);
      setLoading(false);
    },
    onError: error => errorPopUp(error?.StatusCode, error?.error?.description),
  });

  const errorPopUp = (code: number, desc: string | null) => {
    setLoading(false);

    ToastAndroid.showWithGravity(
      desc
        ? desc
        : `We couldn't complete your request, please try again!${
            code ? ` [${code}]` : ''
          }`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  //

  const setData = () => {
    setRsvpState(tempVal);
  };

  return (
    <>
      {loading ? (
        <View>
          <ActivityIndicator color="#fff" />
        </View>
      ) : (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchorPosition="bottom"
          contentStyle={{
            backgroundColor: '#3A2537',
            borderWidth: 0.5,
            borderColor: '#fff',
          }}
          anchor={<RSVPUI rsvp={rsvpState} onPress={openMenu} menu={true} />}>
          <RSVPUI rsvp={'Y'} onPress={() => selectRSVP('Y')} />
          <RSVPUI rsvp={'N'} onPress={() => selectRSVP('N')} />
          <RSVPUI rsvp={'M'} onPress={() => selectRSVP('M')} />
          <RSVPUI rsvp={''} onPress={() => selectRSVP('')} />
        </Menu>
      )}
    </>
  );
};
const RSVPUI = ({
  rsvp,
  menu = false,
  onPress,
}: {
  rsvp: string;
  menu?: boolean;
  onPress: () => void;
}) => {
  const rsvpTitle =
    rsvp === 'Y' ? 'Going' : rsvp === 'N' ? 'No' : rsvp === 'M' ? 'Maybe' : '';
  return (
    <AnimatedPressable
      entering={ZoomIn}
      exiting={ZoomOut}
      onPress={onPress}
      style={{
        backgroundColor: menu ? '#C5B1C33D' : '#3A2537',
        padding: 10,
        paddingHorizontal: menu ? 10 : 16,
        gap: menu ? 8 : 16,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
      }}>
      {/* {rsvp === '' ? (
        <View
          style={{
            // width: 20,
            // height: 20,
          }}
        />
      ) : */}
      {rsvp === '' && (
        <View
          style={{
            width: 6,
            height: 6,
          }}
        />
      )}
      {rsvp !== '' && <RSVPIconCompo icon={rsvp} size={20} />}

      <Text variant={'DetailBold'} style={{color: '#fff'}}>
        {rsvpTitle ? rsvpTitle : 'Select '}
      </Text>
      {rsvp === '' && (
        <View
          style={{
            width: 6,
            height: 6,
          }}
        />
      )}
      {menu && <DownSVG />}
    </AnimatedPressable>
  );
};
