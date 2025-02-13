import React, {memo, useCallback, useState} from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import Animated, {
  FadeInLeft,
  FadeOut,
  FadeOutLeft,
  useSharedValue,
} from 'react-native-reanimated';
import Text from '../../../components/Text';
import Switch from '../../../components/Switch';
import SelectDropdown from 'react-native-select-dropdown';
import {DownSVG} from '../../../assets/SVG/IconsSVG';
import PopupCompo from '../../../components/PopupCompo';
import {RSVPResponceData} from '../EveDetType';

const {width, height} = Dimensions.get('screen');
const paddingHorizontal = width * 0.05;

export default memo(
  ({
    settingsData,
    onDataChange,
  }: {
    settingsData: RSVPResponceData;
    onDataChange: (updatedData: RSVPResponceData) => void;
  }) => {
    const handleChange = (key: keyof RSVPResponceData, value: any) => {
      const updatedData = {...settingsData, [key]: value};
      onDataChange(updatedData); // Notify parent of the change
    };
    // console.log('settingsData render', settingsData);
    return (
      <View
        style={{
          flex: 1,
        }}>
        <ScrollView
          contentContainerStyle={{
            gap: 21,
            paddingBottom: 20,
            paddingHorizontal,
          }}>
          <TogleRow
            txtOne="Accept RSVPs"
            txtTwo="Control whether this event is accepting new RSVPs"
            isSwitch={true}
            switchStatus={settingsData.accept_rsvp === 'Y'}
            onSwitchChange={() =>
              handleChange(
                'accept_rsvp',
                settingsData.accept_rsvp === 'Y' ? 'N' : 'Y',
              )
            }
            id={1}
          />
          <TogleRow
            txtOne='Allow guests to respond "Maybe"'
            txtTwo=""
            isSwitch={true}
            switchStatus={settingsData.accept_maybe === 'Y'}
            onSwitchChange={() =>
              handleChange(
                'accept_maybe',
                settingsData.accept_maybe === 'Y' ? 'N' : 'Y',
              )
            }
            id={2}
          />
          <TogleRow
            txtOne={'RSVP button style'}
            txtTwo={'Display emojis or icons on RSVP buttons'}
            dropdown={true}
            id={3}
          />
          <TogleRow
            txtOne="Show count of guests RSVP"
            txtTwo=""
            isSwitch={true}
            switchStatus={settingsData.show_count_guests === 'Y'}
            onSwitchChange={() =>
              handleChange(
                'show_count_guests',
                settingsData.show_count_guests === 'Y' ? 'N' : 'Y',
              )
            }
            id={4}
          />
          <TogleRow
            txtOne="Open event"
            txtTwo="Allow link to be shared or forwarded. Guest not invited by the host will have to login to be added to the guest list."
            isSwitch={true}
            switchStatus={settingsData.open_event === 'Y'}
            onSwitchChange={() =>
              handleChange(
                'open_event',
                settingsData.open_event === 'Y' ? 'N' : 'Y',
              )
            }
            id={5}
          />
          <TogleRow
            txtOne={'Set max capacity'}
            txtTwo={`applicable only if open invitte is On
RSVP will responses will no longer be accepted once "Going" (and +1s) limit is reached.`}
            dropdown={true}
            disabled={!(settingsData.open_event === 'Y')}
            id={6}
          />
          <TogleRow
            txtOne="Guest approval required"
            txtTwo="Guests not invited by the host need to be approved to get on the guest list."
            isSwitch={true}
            switchStatus={settingsData.guest_approval === 'Y'}
            onSwitchChange={() =>
              handleChange(
                'guest_approval',
                settingsData.guest_approval === 'Y' ? 'N' : 'Y',
              )
            }
            disabled={!(settingsData.open_event === 'Y')}
            id={7}
          />
          <TogleRow
            txtOne="Allow plus ones"
            txtTwo=""
            dropdown={true}
            disabled={!(settingsData.open_event === 'Y')}
            id={8}
          />
          <TogleRow
            txtOne="Activity timeline"
            txtTwo=""
            isSwitch={true}
            switchStatus={settingsData.activity_timeline === 'Y'}
            onSwitchChange={() =>
              handleChange(
                'activity_timeline',
                settingsData.activity_timeline === 'Y' ? 'N' : 'Y',
              )
            }
            // disabled={!(settingsData.open_event === 'Y')}
            id={9}
          />
          <TogleRow
            txtOne="Share RSVP status"
            txtTwo="Allow guests to share their RSVP response on the activity timeline."
            isSwitch={true}
            switchStatus={settingsData.guest_status_share === 'Y'}
            onSwitchChange={() =>
              handleChange(
                'guest_status_share',
                settingsData.guest_status_share === 'Y' ? 'N' : 'Y',
              )
            }
            // disabled={!(settingsData.open_event === 'Y')}
            id={10}
          />
          <TogleRow
            txtOne="Add posts"
            txtTwo="Allow guests to write on the wall."
            isSwitch={true}
            switchStatus={settingsData.guest_posts === 'Y'}
            onSwitchChange={() =>
              handleChange(
                'guest_posts',
                settingsData.guest_posts === 'Y' ? 'N' : 'Y',
              )
            }
            // disabled={!(settingsData.open_event === 'Y')}
            id={11}
          />
          <TogleRow
            txtOne="Allow guests to upload photographs"
            txtTwo="Allow guests to add photos. A photo album will be created to view all photos. Host will have the option to delete photos uploaded."
            isSwitch={true}
            switchStatus={settingsData.guest_upload === 'Y'}
            onSwitchChange={() =>
              handleChange(
                'guest_upload',
                settingsData.guest_upload === 'Y' ? 'N' : 'Y',
              )
            }
            // disabled={!(settingsData.open_event === 'Y')}
            id={12}
          />
        </ScrollView>
      </View>
    );
  },
);

const TogleRow = memo(
  ({
    txtOne,
    txtTwo,
    isSwitch = false,
    dropdown = false,
    switchStatus = false,
    onSwitchChange,
    disabled = false,
    id,
  }: {
    txtOne: string;
    txtTwo: string;
    isSwitch?: boolean;
    dropdown?: boolean;
    switchStatus?: boolean;
    onSwitchChange?: () => void;
    disabled?: boolean;
    id: number;
  }) => {
    const isOn = useSharedValue(switchStatus);

    const handlePress = () => {
      isOn.value = !isOn.value;
      if (onSwitchChange) {
        onSwitchChange();
      }
    };
    return (
      <Animated.View
        entering={FadeInLeft.delay(50 * (id - 1))}
        exiting={FadeOutLeft}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            opacity: disabled ? 0.5 : 1,
          }}>
          <View
            style={{
              flex: 1,
              gap: 5,
            }}>
            <Text
              variant={'BodyRegular'}
              style={{
                color: '#fff',
              }}>
              {txtOne}
            </Text>
            {txtTwo.length > 0 && (
              <Text
                variant={'DetailRegular'}
                style={{
                  color: '#fff',
                }}>
                {txtTwo}
              </Text>
            )}
          </View>
          <View>
            {isSwitch && (
              <Switch
                value={isOn}
                onPress={disabled ? null : handlePress}
                style={{}}
              />
            )}
            {dropdown && <DropdownCompo />}
          </View>
        </View>
      </Animated.View>
    );
  },
);
const DropdownCompo = memo(() => {
  return (
    <SelectDropdown
      data={[
        {title: 'All', id: 1},
        // {title: 'Not All', id: 2},
        // {title: 'Maybe All', id: 3},
        // {title: 'Maybe Not All', id: 2},
      ]}
      onSelect={(selectedItem, index) => {
        // console.log(selectedItem, index);
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <View
            style={{
              backgroundColor: '#C5B1C33D',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: width * 0.2,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 5,
              gap: 4,
            }}>
            <Text variant={'DetailBold'} style={{color: '#fff', flex: 1}}>
              {(selectedItem && selectedItem.title) || 'All'}
            </Text>
            <DownSVG width={12} height={12} />
          </View>
        );
      }}
      renderItem={(item, index, isSelected) => {
        return (
          <View
            style={{
              backgroundColor: '#C5B1C3',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderBottomWidth: 0.5,
              borderColor: '#75486F380',
              ...(isSelected && {backgroundColor: '#75486F'}),
            }}>
            <Text
              variant={'DetailBold'}
              style={{color: isSelected ? '#fff' : '#000'}}>
              {item.title}
            </Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={{
        backgroundColor: '#C5B1C3',
        borderRadius: 5,
      }}
    />
  );
});
