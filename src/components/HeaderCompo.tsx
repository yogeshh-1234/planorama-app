import {useNavigation} from '@react-navigation/native';
import {memo} from 'react';
import {MainStackNavigation} from '../navigation';
import {Pressable, View} from 'react-native';
import {DownSVG} from '../assets/SVG/IconsSVG';
import Text from './Text';

export default memo(
  ({
    showSave = false,
    onSave,
    onBack,
    title,
    showShare,
    onShare,
    isDraft = false,
  }: {
    showSave?: boolean;
    onSave?: () => void;
    onBack?: () => void;
    title?: string;
    showShare?: boolean;
    onShare?: () => void;
    isDraft?: boolean;
  }) => {
    const navigation = useNavigation<MainStackNavigation>();
    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {!title ? (
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              // borderWidth: 1,
              paddingVertical: 4,
              paddingHorizontal: 2,
            }}
            onPress={() => {
              if (onBack) {
                onBack();
              } else {
                navigation.goBack();
              }
            }}>
            <DownSVG
              width={12}
              height={12}
              style={{
                transform: [{rotate: '90deg'}],
              }}
            />
            <Text variant={'SubTitleTwo'} style={{color: '#fff'}}>
              Back
            </Text>
          </Pressable>
        ) : (
          <View />
        )}
        {title && (
          <Text
            variant={'SubTitleTwo'}
            style={{color: '#fff'}}
            numberOfLines={1}>
            {title}
          </Text>
        )}
        <View />
        {showSave ? (
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
            onPress={() => {
              if (onBack) {
                onBack();
              } else {
                navigation.goBack();
              }
            }}>
            <DownSVG
              width={12}
              height={12}
              style={{
                transform: [{rotate: '90deg'}],
              }}
            />
            <Text variant={'SubTitleTwo'} style={{color: '#fff'}}>
              Back
            </Text>
          </Pressable>
        ) : (
          <View />
        )}
        {title && (
          <Text
            variant={'SubTitleTwo'}
            style={{color: '#fff', alignSelf: 'center', textAlign: 'center'}}
            numberOfLines={1}>
            {title}
          </Text>
        )}
        <View />
        {showSave && (
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
            onPress={onSave}>
            <Text variant={'SubTitleTwo'} style={{color: '#F9BC52'}}>
              Save
            </Text>
          </Pressable>
        )}

        {isDraft ? (
          <Text variant={'SubTitleTwo'} style={{color: '#F9BC52'}}>
            DRAFT
          </Text>
        ) : (
          showShare && (
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
              onPress={onShare}>
              <Text variant={'SubTitleTwo'} style={{color: '#F9BC52'}}>
                Share
              </Text>
            </Pressable>
          )
        )}
      </View>
    );
  },
);
