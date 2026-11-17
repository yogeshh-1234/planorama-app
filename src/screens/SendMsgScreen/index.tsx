import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Clipboard,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {BGline} from '../../assets/SVG/VectorSVG';
import HeaderCompo from '../../components/HeaderCompo';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  MainStackNavigation,
  RootStackParamList,
  guestListType,
} from '../../navigation';
import Text from '../../components/Text';
import {BinSVG, CopySVG, DownSVG, EyeSVG} from '../../assets/SVG/IconsSVG';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import Button from '../../components/Button';
import Animated, {FadeInLeft} from 'react-native-reanimated';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {
  getMsgDataType,
  getMsgError,
  getMsgForm,
  getMsgResponse,
  msgFormType,
  msgSendResponce,
} from './sendMsgType';
import Urls from '../../api/urls';
import {postData} from '../../api';
import LoadingCompo from '../../components/LoadingCompo';
import WhatsAppCompo from './WhatsAppCompo';
import PopupCompo from '../../components/PopupCompo';
import DropDownPicker from 'react-native-dropdown-picker';
import PreviewButt from './components/PreviewButt';

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

      {/* <WhatsAppCompo /> */}
      <MainContainer />
    </View>
  );
}

const MainContainer = () => {
  const {params} = useRoute<RouteProp<RootStackParamList, 'SendMsgScreen'>>();

  const navigation = useNavigation<MainStackNavigation>();
  const richText = useRef<RichEditor>(null);

  const [loading, setLoading] = useState(false);
  const [guestListArray, setGuestListArray] = useState<guestListType[]>([]);
  const [allData, setAllData] = useState<getMsgDataType | null>(null);
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
  useEffect(() => {
    setGuestListArray(params.guestList);
    getData();
  }, []);

  const getData = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (token && id) {
      const formData = {
        mode: 'GET_MESSAGE_META',
        token,
        id,
        event_id: params.eventID,
      };
      setLoading(true);
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<getMsgResponse, getMsgError, getMsgForm>({
    mutationFn: (formData: getMsgForm) =>
      postData<getMsgForm, getMsgResponse>(Urls.WHATSAPP, formData),
    onSuccess: ({data}) => {
      // If template is provided, use template content instead of API message
      if (params.selectedTemplate) {
        setAllData({
          ...data,
          message_template: params.selectedTemplate.content,
        });
      } else {
        setAllData(data);
      }

      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const [popupModal, setPopupModal] = useState(PopupModal);

  const onDismiss = () => setPopupModal({...popupModal, state: false});

  // functions

  const onRemoveGuest = (id: string) => {
    setGuestListArray(pre => {
      const updatedData = pre.filter(item => item.id !== id);
      return updatedData;
    });
  };

  const previewButtOnPress = async () => {
    const msgDataText = await richText.current
      ?.getContentHtml()
      .then(htmlContent => {
        const formatted = convertToWhatsAppFormat(htmlContent);
        return {formatted, htmlContent};
      });

    navigation.navigate('PreviewScreen', {
      eventID: params.eventID,
      guestsIds: guestListArray.map(itm => parseInt(itm.id)), // in array
      message: `${msgDataText?.formatted}`,
      messageHTML: `${msgDataText?.htmlContent}`,
      fileBase: '',
      fileName: '',
      eventName: params.eventName,
      eventPic: params.eventPic,
    });
  };

  return (
    <>
      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={{
          gap: 20,
          paddingBottom: 120,
        }}>
        <Text
          variant={'TitleTwo'}
          style={{
            color: '#fff',
            marginHorizontal: paddingHorizontal,
          }}>
          Send message via WhatsApp
        </Text>
        {params.selectedTemplate && (
          <View
            style={{
              marginHorizontal: paddingHorizontal,
              backgroundColor: '#75486F',
              padding: 12,
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#F9BC52',
            }}>
            <Text
              variant={'BodyBold'}
              style={{color: '#F9BC52', marginBottom: 4}}>
              Using Template: {params.selectedTemplate.title}
            </Text>
            <Text variant={'DetailRegular'} style={{color: '#EDEDED'}}>
              {params.selectedTemplate.category}
            </Text>
          </View>
        )}
        <ImgCompo uri={params.eventPic} />

        {!loading && (
          <MsgCompo
            richText={richText}
            msgData={allData?.message_template ? allData?.message_template : ''}
          />
        )}
        {allData?.rsvp_url && <EventLink link={allData?.rsvp_url} />}
        {guestListArray.length > 0 && (
          <GuestCompo
            guestListArray={guestListArray}
            onRemoveGuest={onRemoveGuest}
          />
        )}
      </ScrollView>
      {loading && <LoadingCompo text="getting message ready..." />}
      {guestListArray.length > 0 && !isKeyboardVisible && (
        <PreviewButt onPress={previewButtOnPress} />
      )}
      <PopupCompo
        isVisible={popupModal.state}
        onDismiss={onDismiss}
        title={popupModal.title}
        disc={popupModal.disc}
        buttOne={popupModal.buttOne}
        buttTwo={popupModal.buttTwo}
        buttOnePress={onDismiss}
        buttTwoPress={onDismiss}
      />
    </>
  );
};

const ImgCompo = memo(({uri}: {uri: string}) => {
  return (
    <View
      style={{
        paddingHorizontal: paddingHorizontal,
      }}>
      <Image
        source={{uri}}
        style={{
          borderRadius: 10,
          height: 200,
          width: '100%',
        }}
      />
      {/* <Pressable
        key={0}
        android_ripple={{color: `#ffffff80`, borderless: false}}
        style={styles.imgGalleryUp}
        // onPress={() => {
        //   handleUploadImage();
        // }}
      >
        <ImageSVG width={40} height={40} />
        <Text variant={'BodyRegular'} style={styles.upTxt}>
          Upload Image
        </Text>
      </Pressable> */}
    </View>
  );
});

const MsgCompo = memo(
  ({richText, msgData}: {richText: RichEditor; msgData: string}) => {
    const scrollRef = useRef<ScrollView>(null);

    return (
      <View
        style={{
          paddingHorizontal,
          gap: 15,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#fff',
            }}
            variant={'BodyRegular'}>
            Message
          </Text>
          <View>
            <SelectNameCompo
              onSelectedID={data => {
                richText.current?.insertText(data);
              }}
            />
          </View>
        </View>
        <View>
          <View
            style={{
              backgroundColor: '#C5B1C33D',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              height: 200,
            }}>
            <ScrollView
              nestedScrollEnabled
              ref={scrollRef}
              keyboardShouldPersistTaps="handled">
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}>
                <RichEditor
                  ref={richText}
                  initialContentHTML={
                    convertWhatsappTextToHTML(msgData)
                    //   `<div>hey</div>
                    // <div><b>hey</b></div>
                    // <div><i>hey</i></div>
                    // <div><strike>hey</strike></div>
                    // <div><strike><i>hey</i></strike></div>
                    // <div><i style=""><b>hey</b></i></div><div><b><i>1st line</i></b></div><div><b><i><br></i></b></div><div><i style=""><b>2nd line</b></i></div><div><br></div><div><br></div><div><b><i>3rd line</i></b></div>
                    // <div><b style=""><strike>hey</strike></b></div>
                    // <code type="">hey</code>`
                  }
                  onChange={() => {}}
                  useContainer={true} // Enable internal scroll handling within the editor
                  // onCursorPosition={handleCursorPosition} // Handle scroll adjustment
                  editorStyle={{
                    backgroundColor: 'transparent',
                    color: '#fff',
                    contentCSSText: `
                  code {
                    background-color: #C5B1C33D !important; /* Set your desired background color */
                    color: #fff !important; /* Set your desired text color */
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
              </KeyboardAvoidingView>
            </ScrollView>
          </View>
          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setStrikethrough,
              actions.code,
              actions.undo,
              actions.redo,
            ]}
            selectedButtonStyle={{
              backgroundColor: '#75486F80',
            }}
          />
        </View>
      </View>
    );
  },
);
const EventLink = memo(({link}: {link: string}) => {
  return (
    <View
      style={{
        paddingHorizontal,
        gap: 15,
      }}>
      <Text
        style={{
          color: '#fff',
        }}
        variant={'BodyRegular'}>
        Event link
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#C5B1C33D',
          borderRadius: 10,
        }}>
        <Text
          style={{color: '#fff', marginLeft: 14, flex: 1}}
          variant={'BodyRegular'}
          numberOfLines={1}>
          {link}
        </Text>
        <Pressable
          onPress={() => {
            Clipboard.setString(link);
          }}
          style={{
            padding: 14,
          }}>
          <CopySVG width={20} height={20} />
        </Pressable>
      </View>
    </View>
  );
});
const GuestCompo = memo(
  ({
    guestListArray,
    onRemoveGuest,
  }: {
    guestListArray: guestListType[];
    onRemoveGuest: (id: string) => void;
  }) => {
    return (
      <View
        style={{
          paddingHorizontal,
          gap: 15,
        }}>
        <Text
          style={{
            color: '#fff',
          }}
          variant={'BodyRegular'}>
          Recipients
        </Text>
        <View>
          <FlatList
            data={guestListArray}
            renderItem={({item, index}) => (
              <Animated.View
                entering={FadeInLeft.delay(index * 100)}
                // exiting={FadeOutLeft}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    gap: 12,
                  }}>
                  <Image
                    source={{
                      uri: `https://avatar.iran.liara.run/username?username=${item.name.replaceAll(
                        ' ',
                        '+',
                      )}`,
                    }}
                    style={{
                      borderRadius: 30,
                      width: 35,
                      height: 35,
                    }}
                  />
                  <Text variant={'DetailBold'} style={{color: '#fff'}}>
                    {item.name}
                  </Text>
                </View>
                <Pressable
                  style={{
                    padding: 4,
                  }}
                  onPress={() => onRemoveGuest(item.id)}>
                  <BinSVG width={18} height={18} fill={'#fff'} />
                </Pressable>
              </Animated.View>
            )}
          />
        </View>
      </View>
    );
  },
);

const convertToWhatsAppFormat = (html: string): string => {
  const replacements: {[key: string]: string} = {
    '<b>': '*',
    '</b>': '*',
    '<i>': '_',
    '</i>': '_',
    '<strike>': '~',
    '</strike>': '~',
    '<pre>': '```',
    '</pre>': '```',
    '<code>': '`',
    '</code>': '`',
    '<div>': '',
    '</div>': '\n', // Handle <div> as line breaks
    '<br>': '',
    '</br>': '', // Treat <br> as a line break
    '<br/>': '',
    '<br />': '', // Treat <br /> as a line break
    '&nbsp;': '',
  };

  // Remove inline styles like `style=""` from tags
  html = html.replace(/ style="[^"]*"/g, '');

  // Replace tags based on the mappings
  let formattedText = html;

  formattedText = formattedText
    .replace(/\s+/g, ' ') // Replace multiple whitespaces with a single space
    .replace(/\n+/g, ' ') // Replace newlines with a single space
    .trim();

  for (const [key, value] of Object.entries(replacements)) {
    formattedText = formattedText.replace(new RegExp(key, 'g'), value);
  }

  // Clean up the <code> and <pre> tags
  formattedText = formattedText
    .replace(/<code[^>]*>/g, '`') // Clean <code> tag by removing attributes
    .replace(/<\/code>/g, '`') // Close <code> tag with backticks
    .replace(/<pre[^>]*>/g, '```') // Clean <pre> tag by removing attributes
    .replace(/<\/pre>/g, '```'); // Close <pre> tag with triple backticks

  // Remove leading whitespace before processing
  formattedText = formattedText.trim();

  // Clean up extra spaces and multiple empty lines
  // formattedText = formattedText
  //   .replace(/\n{2,}/g, '\n')  // Replace multiple newlines with a single one
  //   .replace(/^\s+/gm, '')     // Remove leading spaces/tabs from each line
  //   .trim(); // Trim leading and trailing newlines/spaces

  return formattedText;
};

function convertWhatsappTextToHTML(text: string) {
  // Convert bold text (*bold*)
  text = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

  // Convert italic text (_italic_)
  text = text.replace(/_(.*?)_/g, '<em>$1</em>');

  // Convert strikethrough text (~strikethrough~)
  text = text.replace(/~(.*?)~/g, '<del>$1</del>');

  // Convert monospace text (`monospace`)
  text = text.replace(/`(.*?)`/g, '<code>$1</code>');

  // Split text by newlines and wrap each line in a <div>
  const lines = text.split('\n');
  text = lines.map(line => `<div>${line}</div>`).join('');

  return text;
}

const SelectNameCompo = ({
  onSelectedID,
}: {
  onSelectedID: (id: string) => void;
}) => {
  const shortcodes = {
    '[guest-name]': 'Guest Name',
    '[event-name]': 'Event Name',
    '[event-date]': 'Event Date',
    '[event-place]': 'Event Place',
  };

  // Convert shortcodes object to dropdown items
  const dropdownItems = Object.entries(shortcodes).map(([value, label]) => ({
    label, // Label to display
    value, // Actual value
  }));

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null); // Selected value from dropdown

  return (
    <Pressable
      style={{
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#C5B1C380',
        borderRadius: 4,
      }}
      onPress={() => {
        onSelectedID('[guest-name]');
      }}>
      <Text style={{color: '#fff'}} variant={'BodyRegular'}>
        [guest-name]
      </Text>
    </Pressable>
    // <DropDownPicker
    //   open={open}
    //   value={selectedValue}
    //   items={dropdownItems}
    //   setOpen={setOpen}
    //   setValue={val => {
    //     onSelectedID(val('').toString());
    //   }}
    //   placeholder="Insert name"
    //   placeholderStyle={{
    //     color: '#fff',
    //   }}
    //   textStyle={{
    //     color: '#fff',
    //   }}
    //   ArrowUpIconComponent={() => (
    //     <DownSVG
    //       width={16}
    //       height={16}
    //       style={{
    //         transform: [{rotate: '180deg'}],
    //       }}
    //     />
    //   )}
    //   ArrowDownIconComponent={() => <DownSVG width={16} height={16} />}
    //   style={styles.dropdown}
    //   dropDownContainerStyle={styles.dropdownContainer}
    // />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    minWidth: 150,
    backgroundColor: '#C5B1C380',
    // gap: 20,
    // paddingHorizontal: 15,
    paddingVertical: 8,
    flex: 0,
  },
  dropdownContainer: {
    minWidth: 150,
    backgroundColor: '#75486F',
  },
});
