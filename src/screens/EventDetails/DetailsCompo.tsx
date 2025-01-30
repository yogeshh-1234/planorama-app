import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
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
const {width, height} = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

export default function ({
  title,
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
}: {
  title: string;
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
  hostList?: {
    event_assoc_id: string;
    name: string;
    pic: string;
  }[];
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
          {date.length > 0 && (
            <Animated.View
              entering={ZoomIn.delay(400)}
              exiting={ZoomOut}
              style={{
                backgroundColor: '#F9BC52',
                borderRadius: 6,
                padding: 6,
              }}>
              <CalenderSVG width={20} height={20} fill={'#fff'} />
            </Animated.View>
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
      <View>
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
      </View>
    </View>
  );
}

const ImageCompo = memo(
  ({uri, ImgSize, delay}: {uri: string; ImgSize: number; delay: number}) => {
    const [showImg, setShowImg] = useState(false);
    const toggleImg = () => setShowImg(pre => !pre);
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
        <ActivityIndicator
          color={'#fff'}
          size={'large'}
          style={{
            position: 'absolute',
          }}
        />
        {uri.length > 0 && (
          <Pressable onPress={toggleImg}>
            <Image
              style={{
                width: ImgSize,
                height: ImgSize,
                borderRadius: 10,
                alignSelf: 'center',
              }}
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
const HostedByCompo = memo(
  ({
    hostList,
  }: {
    hostList:
      | {
          event_assoc_id: string;
          name: string;
          pic: string;
        }[]
      | undefined;
  }) => {
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

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,

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
