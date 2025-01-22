import React, {useEffect, useRef} from 'react';
import {Dimensions, Image, ScrollView, StatusBar, View} from 'react-native';
import {BGline} from '../../assets/SVG/VectorSVG';
import HeaderCompo from '../../components/HeaderCompo';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MainStackNavigation, RootStackParamList} from '../../navigation';
import Text from '../../components/Text';
import moment from 'moment';
import WhatsAppCompo from './WhatsAppCompo';
import {RichEditor} from 'react-native-pell-rich-editor';
import SendMsgButt from './SendMsgButt';
const {width, height} = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};

const paddingHorizontal = width * 0.05;
export default function () {
  const navigation = useNavigation<MainStackNavigation>();
  const onBack = () => {
    navigation.goBack();
  };
  return (
    <View
      style={{
        backgroundColor: '#3A2537',
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
      <HeaderCompo onBack={onBack} />
      <View
        style={{
          flex: 1,
        }}>
        <WhatsAppCompo />
        <MainContainer />
      </View>
    </View>
  );
}
const MainContainer = () => {
  const {params} = useRoute<RouteProp<RootStackParamList, 'PreviewScreen'>>();

  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Scroll to the end when the component is mounted
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, []);
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      <View
        style={{
          width: width * 0.9,
          height: height * 0.7,
        }}>
        <Image
          source={require('../../assets/images/WABack.png')}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 30,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            borderWidth: 1,
            borderColor: '#fff',
          }}
        />
        <ScrollView
          style={{
            borderRadius: 30,
          }}
          ref={scrollViewRef}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              padding: 25,
            }}>
            <View
              style={{
                width: width * 0.65,
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                }}>
                <Image
                  source={require('../../assets/images/Shape.png')}
                  resizeMode="stretch"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>
              <View
                style={{
                  paddingLeft: 10 + 6,
                  paddingRight: 6,
                  paddingTop: 6,
                  paddingBottom: 6,
                  gap: 6,
                }}>
                <Image
                  source={require('../../assets/images/EventImg.png')}
                  resizeMode="stretch"
                  style={{
                    borderRadius: 6,
                    width: width * 0.65 - 16 - 6,
                    height: width * 0.65 - 16 - 6,
                  }}
                />

                <RichEditor
                  initialContentHTML={params.messageHTML}
                  onChange={descriptionText => {}}
                  disabled={true}
                  scrollEnabled={false}
                  // useContainer={true} // Enable internal scroll handling within the editor
                  // onCursorPosition={handleCursorPosition} // Handle scroll adjustment
                  editorStyle={{
                    backgroundColor: 'transparent',
                    color: '#000',
                    contentCSSText: `
                  code {
                    background-color: #C5B1C33D !important; /* Set your desired background color */
                    color: #000 !important; /* Set your desired text color */
                    font-family: monospace !important;
                    padding: 4px 8px !important;
                    border: none !important; /* Remove any default border */
                    box-shadow: none !important; /* Remove shadow effect */
                    display: inline-block !important; /* Ensure proper display */
                  }
      
                  /* Remove parent container styles that might be affecting the code block */
                  pre {
                    background: transparent !important; /* Remove white background from parent */
                    border: none !important; /* Remove any border on pre tag */
                    margin: 0 !important; /* Remove margins */
                    padding: 0 !important; /* Remove padding */
                    box-shadow: none !important; /* Remove shadow from parent */
                  }
                  `,
                  }}
                />
                <Text
                  variant={'DetailRegular'}
                  style={{color: '#2E2E2E80', alignSelf: 'flex-end'}}>
                  {moment().format('hh:mm a')}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <SendMsgButt
        lable={`SEND MESSAGE TO ${params.guestsIds.length} GUESTS`}
        event_id={params.eventID}
        guests_ids={JSON.stringify(params.guestsIds)}
        message={params.message}
        count={params.guestsIds.length}
        eventName={params.eventName}
      />
    </View>
  );
};
// variant={'DetailBold'} style={{color: '#4F4F4F'}}
