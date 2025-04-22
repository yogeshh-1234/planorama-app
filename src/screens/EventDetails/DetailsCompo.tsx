import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../components/Text';
import {fonts} from '../../config/constants';
import {
  CalenderSVG,
  ClockSVG,
  LocSVG,
  QuesSVG,
  ThumbsUpSVG,
} from '../../assets/SVG/IconsSVG';
import moment from 'moment';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInUp,
  FadeOut,
  FadeOutLeft,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {storage} from '../../functions/storage';
import ImageViewer from '../../components/ImageViewer';
import RNCalendarEvents, {Calendar} from 'react-native-calendar-events';
import {Portal} from 'react-native-paper';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const {width, height} = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

export default function ({
  title,
  link,
  fontId,
  cover_img,
  bg_img,
  colorHex,
  date,
  time,
  location,
  isLink,
  description,
  rsvp,
  gallery,
  galleryLoading = false,
  hostList,
  isAddOnList = false,
}: {
  title: string;
  link: string;
  fontId: string;
  cover_img: string;
  bg_img: string;
  colorHex: string;
  date: string;
  time: string;
  location: string;
  isLink: boolean;
  description: string;
  rsvp: 'Y' | 'N' | 'M' | null;
  gallery: string[];
  galleryLoading?: boolean;
  hostList?: host_list_Type[];
  isAddOnList: boolean;
}) {
  const fontName = useMemo(() => {
    let idx = fonts.findIndex(itm => itm.id === fontId);
    if (idx !== -1) {
      return fonts[idx].name;
    } else {
      return 'PoppinsMedium';
    }
  }, [title]);

  return (
    <View style={styles.container}>
      <Text
        entering={FadeIn}
        variant={'DetailRegular'}
        style={[
          styles.title,
          {
            fontFamily: fontName,
          },
        ]}>
        {title}
      </Text>
      {link && (
        <Text
          onPress={() => {
            Clipboard.setString(link);
          }}
          entering={FadeIn}
          variant={'DetailRegular'}
          style={{
            color: '#fff',
            alignSelf: 'center',
            textAlign: 'center',
            textDecorationLine: 'underline',
          }}>
          {link}
        </Text>
      )}

      {/*  */}
      <ImageCompo uri={cover_img} ImgSize={width * 0.9} delay={100} />
      <View style={styles.dateLoc}>
        <View style={styles.dateRow}>
          <Text
            variant={'SubTitleOne'}
            style={styles.txtColor}
            entering={FadeInLeft.delay(200)}
            exiting={FadeOutLeft}>
            {date.length > 0 &&
              moment(date, 'DD/MM/YYYY').format('MMMM DD, YYYY')}
          </Text>

          {date.length > 0 && !isAddOnList && (
            <CalenderButt
              title={title}
              date={moment(
                `${date} ${time}`,
                'DD/MM/YYYY hh:mm a',
              ).toISOString()}
              notes={description}
              location={location}
            />
          )}
        </View>
        <Animated.View
          style={styles.timeRow}
          entering={FadeInLeft.delay(300)}
          exiting={FadeOutLeft}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            {time.length > 0 && (
              <ClockSVG width={10} height={10} fill={'#fff'} />
            )}
            <Text variant={'DetailBold'} style={styles.txtColor}>
              {time}
            </Text>
          </View>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              flex: 1,
            }}
            onPress={
              isLink
                ? () => {
                    Linking.openURL(location);
                  }
                : null
            }>
            {location.length > 0 && (
              <LocSVG width={10} height={10} fill={'#fff'} />
            )}
            <Text
              variant={'DetailBold'}
              style={[
                styles.txtColor,
                {textDecorationLine: isLink ? 'underline' : 'none'},
              ]}>
              {location}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
      <HostedByCompo hostList={hostList} />
      <View>
        <Text
          variant={'DetailBold'}
          style={styles.txtColor}
          entering={FadeIn.delay(500)}
          exiting={FadeOut}>
          {description}
        </Text>
      </View>
      <View
        style={{
          opacity: isAddOnList ? 0.4 : 1,
        }}>
        {galleryLoading ? (
          <View
            style={{
              height: width * 0.3,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 12,
            }}>
            <ActivityIndicator color={'#fff'} />
            <Text style={{color: '#fff'}} variant={'BodyRegular'}>
              {' '}
              Loading Gallery...
            </Text>
          </View>
        ) : (
          gallery.length > 0 && (
            <ScrollView
              horizontal
              contentContainerStyle={{
                gap: 10,
                paddingVertical: 12,
              }}>
              {gallery.map((itm, idx) => (
                // <GalleryImgCompo itm={itm} idx={idx} key={idx} />
                <ImageCompo
                  uri={itm}
                  ImgSize={width * 0.3}
                  delay={600 + idx * 50}
                  key={idx}
                />
              ))}
            </ScrollView>
          )
        )}
        {isAddOnList && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: 'transparent',
            }}
          />
        )}
      </View>
    </View>
  );
}

export const ImageCompo = memo(
  ({uri, ImgSize, delay}: {uri: string; ImgSize: number; delay: number}) => {
    const [showImg, setShowImg] = useState(false);
    const toggleImg = () => setShowImg(pre => !pre);

    const [loading, setLoading] = useState(false);
    return (
      <Animated.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: ImgSize,
          height: ImgSize,
          borderRadius: 10,
        }}
        entering={FadeIn.delay(delay)}
        exiting={FadeOut}>
        {loading && (
          <ActivityIndicator
            color={'#fff'}
            size={'large'}
            style={{
              position: 'absolute',
            }}
          />
        )}
        {uri.length > 0 && (
          <Pressable onPress={toggleImg}>
            <Image
              style={{
                width: ImgSize,
                height: ImgSize,
                borderRadius: 10,
                alignSelf: 'center',
              }}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              source={{uri}}
            />
          </Pressable>
        )}

        {showImg && (
          <ImageViewer
            imageUrl={uri}
            width={width}
            height={height - 50 - Top_Height}
            onRequestClose={toggleImg}
          />
        )}
      </Animated.View>
    );
  },
);
export const HostedByCompo = memo(
  ({hostList}: {hostList: host_list_Type[] | undefined}) => {
    const [data, setProfileData] = useState({
      name: '',
      pic: '',
    });

    useEffect(() => {
      const tempName = storage.getString('user.name');
      const tempPic = storage.getString('user.pic');
      if (
        tempName !== null &&
        tempName !== undefined &&
        tempPic !== null &&
        tempPic !== undefined
      ) {
        setProfileData({
          pic: tempPic,
          name: tempName,
        });
      }
    }, []);

    return (
      <Animated.View
        entering={FadeIn.delay(400)}
        exiting={FadeOut}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}>
        {hostList && hostList.length > 0 ? (
          <>
            {/* {hostList.map(itm => ( */}
            <Image
              source={{
                uri: hostList[0].pic,
              }}
              style={{
                width: 21,
                height: 21,
                borderRadius: 100,
              }}
            />
            {/* ))} */}
            <Text variant={'BodyBold'} style={{color: '#F9BC52'}}>
              {hostList[0].name}
            </Text>
            {hostList.length > 1 && (
              <Text variant={'BodyBold'} style={{color: '#ffffff80'}}>
                +{hostList.length - 1} more
              </Text>
            )}
          </>
        ) : (
          <>
            {data.pic.length > 0 && (
              <Image
                source={{
                  uri: data.pic,
                }}
                style={{
                  width: 21,
                  height: 21,
                  borderRadius: 100,
                }}
              />
            )}
            <Text variant={'BodyBold'} style={{color: '#F9BC52'}}>
              {data.name}
            </Text>
          </>
        )}
      </Animated.View>
    );
  },
);
import Modal from 'react-native-modal';
import {host_list_Type} from './EveDetType';

const CalenderButt = memo(
  ({
    title,
    date,
    notes,
    location,
  }: {
    title: string;
    date: string;
    notes: string;
    location: string;
  }) => {
    const [calendars, setCalendars] = useState<Calendar[]>([]);
    const [showModal, setShowModal] = useState(false);

    const fetchCalendars = async () => {
      try {
        const status = await RNCalendarEvents.requestPermissions();
        if (status !== 'authorized') {
          Alert.alert(
            'Permission denied',
            'Calendar access is required to create events.',
          );
          return;
        }

        const calendars = await RNCalendarEvents.findCalendars();
        // console.log(calendars);
        setCalendars(calendars.filter(itm => itm.isPrimary));
        setShowModal(true);
      } catch (error) {
        console.error('Error fetching calendars:', error);
        Alert.alert('Error', 'Failed to fetch calendars.');
      }
    };

    interface EventDetails {
      title: string;
      startDate: string;
      endDate: string;
      notes: string;
      location: string;
      calendarId: string;
    }

    const createEvent = async (calendarId: string) => {
      try {
        const eventDetails: EventDetails = {
          title,
          startDate: date,
          endDate: date,
          notes: 'This is a test event created from React Native.',
          location: '123 Main St, City, Country',
          calendarId: calendarId,
        };

        const eventId = await RNCalendarEvents.saveEvent(
          eventDetails.title,
          eventDetails,
        );
        Alert.alert('Event created', `Event ID: ${eventId}`);
        setShowModal(false);
      } catch (error) {
        console.error('Error creating event:', error);
        Alert.alert('Error', 'Failed to create the event.');
      }
    };

    return (
      <>
        <AnimatedPressable
          onPress={fetchCalendars}
          entering={ZoomIn.delay(400)}
          exiting={ZoomOut}
          style={{
            backgroundColor: '#F9BC52',
            borderRadius: 6,
            padding: 6,
          }}>
          <CalenderSVG width={20} height={20} fill={'#fff'} />
        </AnimatedPressable>
        <Modal
          isVisible={showModal}
          onBackdropPress={() => setShowModal(false)}>
          <View style={styles.popup}>
            <Text
              style={{color: '#fff', alignSelf: 'center', marginBottom: 4}}
              variant={'BodyRegular'}>
              Select Account
            </Text>
            <ScrollView style={{maxHeight: height * 0.5}}>
              {calendars.map(calendar => (
                <Pressable
                  key={calendar.id}
                  onPress={() => createEvent(calendar.id)}
                  style={styles.calendarItem}>
                  <Text style={styles.calendarText}>{calendar.title}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -150}, {translateY: -150}],
    width: 300,
    maxHeight: 300,
    backgroundColor: '#75486F',
    borderRadius: 10,
    padding: 20,
    zIndex: 1000,
  },
  calendarItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc80',
  },
  calendarText: {
    fontSize: 16,
    color: '#fff',
  },
  container: {
    gap: 21,
    // paddingVertical: 21,
  },
  title: {
    fontSize: 25,
    lineHeight: 38,
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
  },
  imgSty: {},
  dateLoc: {},
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRow: {
    // flexDirection: 'row',
    // alignItems: 'center',
    gap: 8,

    paddingTop: 8,
  },
  hostDet: {},
  txtColor: {
    color: '#EDEDED',
  },
  color_W: {
    color: '#fff',
    lineHeight: 24,
  },
});
