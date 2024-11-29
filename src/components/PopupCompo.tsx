import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {memo} from 'react';
import {MotiView, useAnimationState} from 'moti';
import Text from './Text';
import {FadeIn, FadeOut} from 'react-native-reanimated';
const {width, height} = Dimensions.get('screen');
const space = 20;
export default memo(
  ({
    isVisible,
    onDismiss,
    title = '',
    disc = '',
    buttOne = '',
    buttTwo = '',
    buttOnePress,
    buttTwoPress,
  }: {
    isVisible: boolean;
    onDismiss: () => void;
    title?: string;
    disc?: string;
    buttOne?: string;
    buttTwo?: string;
    buttOnePress?: () => void;
    buttTwoPress?: () => void;
  }) => {
    const buttOneState = useAnimationState({
      from: {
        scale: 1,
      },
      to: {
        scale: 1,
      },
      pressd: {scale: 0.97},
    });
    const buttTwoState = useAnimationState({
      from: {
        scale: 1,
      },
      to: {
        scale: 1,
      },
      pressd: {scale: 0.97},
    });

    return (
      <Modal
        isVisible={isVisible}
        style={{
          alignItems: 'center',
        }}
        animationIn={'zoomIn'}
        animationOut={'fadeOutDown'}>
        <View style={styles.box}>
          {isVisible && (
            <Text
              variant={'SubTitleTwo'}
              style={styles.title}
              entering={FadeIn}
              exiting={FadeOut}>
              {title}
            </Text>
          )}
          <View style={styles.divider} />
          {isVisible && (
            <Text
              variant={'BodyRegular'}
              style={styles.disc}
              entering={FadeIn}
              exiting={FadeOut}>
              {disc}
            </Text>
          )}
          <View style={styles.divider} />
          <View style={styles.buttRow}>
            {buttOne !== '' && (
              <Pressable
                onPressIn={() => buttOneState.transitionTo('pressd')}
                onPressOut={() => buttOneState.transitionTo('to')}
                onPress={buttOnePress}
                style={{flex: 1}}>
                <MotiView style={styles.buttOne} state={buttOneState}>
                  <Text variant={'SubTitleOne'} style={styles.buttOneTxt}>
                    {buttOne}
                  </Text>
                </MotiView>
              </Pressable>
            )}
            <Pressable
              onPressIn={() => buttTwoState.transitionTo('pressd')}
              onPressOut={() => buttTwoState.transitionTo('to')}
              onPress={buttTwoPress}
              style={{flex: 1}}>
              <MotiView style={styles.buttTwo} state={buttTwoState}>
                <Text variant={'SubTitleOne'} style={styles.buttTwoTxt}>
                  {buttTwo}
                </Text>
              </MotiView>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  box: {
    padding: space,
    gap: space,
    backgroundColor: '#75486F',
    borderRadius: 12,
    minWidth: '85%',
  },
  title: {
    color: '#fff',
    textTransform: 'uppercase',
    alignSelf: 'center',
    textAlign: 'center',
  },
  divider: {
    opacity: 0.25,
    height: 1,
    width: width * 0.3,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  disc: {
    color: '#fff',
    textAlign: 'center',
    alignSelf: 'center',
  },
  buttRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space,
  },
  buttOne: {
    backgroundColor: '#2D2D2D',
    // flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,

    shadowColor: '#fff',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // elevation: 5,
  },
  buttOneTxt: {
    color: '#fff',
    fontFamily: 'Mulish-Regular',
    textTransform: 'uppercase',
  },
  buttTwo: {
    backgroundColor: '#F9BC52',
    // flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
    shadowColor: '#fff',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // elevation: 5,
  },
  buttTwoTxt: {
    color: '#fff',
    fontFamily: 'Mulish-SemiBold',
    textTransform: 'uppercase',
  },
});
