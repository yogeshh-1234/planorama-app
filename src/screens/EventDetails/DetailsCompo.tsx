import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
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
const {width, height} = Dimensions.get('screen');

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
      <ImageCompo uri={cover_img} />
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
      <HostedByCompo />
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
                <Animated.Image
                  entering={FadeIn.delay(600 + idx * 50)}
                  exiting={FadeOut}
                  source={{uri: itm}}
                  style={{
                    width: width * 0.3,
                    height: width * 0.3,
                    borderRadius: 10,
                  }}
                />
              ))}
            </ScrollView>
          )
        )}
      </View>
    </View>
  );
}
const ImageCompo = memo(({uri}: {uri: string}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Animated.View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: 10,
      }}
      entering={FadeIn.delay(100)}
      exiting={FadeOut}>
      <ActivityIndicator
        color={'#fff'}
        size={'large'}
        style={{
          position: 'absolute',
        }}
      />
      {uri.length > 0 && (
        <Image
          style={styles.imgSty}
          source={{uri}}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      )}
    </Animated.View>
  );
});
const HostedByCompo = memo(() => {
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
    </Animated.View>
  );
});


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
  imgSty: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 10,
    alignSelf: 'center',
  },
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
