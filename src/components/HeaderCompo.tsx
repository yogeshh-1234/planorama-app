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
  }: {
    showSave?: boolean;
    onSave?: () => void;
    onBack?: () => void;
  }) => {
    const navigation = useNavigation<MainStackNavigation>();
    return (
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
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
      </View>
    );
  },
);
