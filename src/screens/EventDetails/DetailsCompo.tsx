import React, {memo, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
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
  description,
  rsvp,
  gallery,
}: {
  title: string;
  fontId: string;
  cover_img: string;
  bg_img: string;
  colorHex: string;
  date: string;
  time: string;
  location: string;
  description: string;
  rsvp: 'Y' | 'N' | 'M' | null;
  gallery: string[];
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
          <Text variant={'SubTitleOne'} style={styles.txtColor}>
            {/* December 31, 2024 */}
            {moment(date, 'DD/MM/YYYY').format('MMMM DD, YYYY')}
          </Text>
          <View
            style={{
              backgroundColor: '#F9BC52',
              borderRadius: 6,
              padding: 6,
            }}>
            <CalenderSVG width={20} height={20} fill={'#fff'} />
          </View>
        </View>
        <View style={styles.timeRow}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <ClockSVG width={10} height={10} fill={'#fff'} />
            <Text variant={'DetailBold'} style={styles.txtColor}>
              {time}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <LocSVG width={10} height={10} fill={'#fff'} />
            <Text variant={'DetailBold'} style={styles.txtColor}>
              {location}
            </Text>
          </View>
        </View>
        {/* <View style={styles.hostDet}></View> */}
      </View>
      <View>
        <Text variant={'DetailBold'} style={styles.txtColor}>
          {description}
        </Text>
      </View>
      <View>
        {gallery.length > 0 && (
          <ScrollView
            horizontal
            contentContainerStyle={{
              gap: 10,
              paddingVertical: 12,
            }}>
            {gallery.map(itm => (
              <Image
                source={{uri: itm}}
                style={{
                  width: width * 0.3,
                  height: width * 0.3,
                  // borderRadius: 10,
                }}
              />
            ))}
          </ScrollView>
        )}
      </View>
      <View>
        <RSVPCompo value={rsvp} />
      </View>
    </View>
  );
}
const IconSize = width * 0.15;
const RSVPCompo = memo(({value}: {value: 'Y' | 'N' | 'M' | null}) => {
  return (
    <View style={styles.rsvpRow}>
      <View style={styles.rsvpCompo}>
        <ThumbsUpSVG
          width={IconSize}
          height={IconSize}
          fill={value === 'Y' ? '#FFF' : '#C5B1C3'}
        />
        <Text
          variant={value === 'Y' ? 'SubTitleTwo' : 'BodyRegular'}
          style={[styles.color_W]}>
          Going
        </Text>
      </View>
      <View style={styles.rsvpCompo}>
        <QuesSVG
          width={IconSize}
          height={IconSize}
          fill={value === 'M' ? '#FFF' : '#C5B1C3'}
        />
        <Text
          variant={value === 'M' ? 'SubTitleTwo' : 'BodyRegular'}
          style={[styles.color_W, {}]}>
          May be
        </Text>
      </View>
      <View style={styles.rsvpCompo}>
        <ThumbsUpSVG
          width={IconSize}
          height={IconSize}
          fill={value === 'N' ? '#FFF' : '#C5B1C3'}
          style={{
            transform: [{rotate: '180deg'}],
          }}
        />
        <Text
          variant={value === 'N' ? 'SubTitleTwo' : 'BodyRegular'}
          style={[styles.color_W]}>
          No
        </Text>
      </View>
    </View>
  );
});
const ImageCompo = memo(({uri}: {uri: string}) => {
  const [loading, setLoading] = useState(false);
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        style={styles.imgSty}
        source={{uri}}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />

      {loading && (
        <ActivityIndicator
          color={'#fff'}
          size={'large'}
          style={{
            position: 'absolute',
          }}
        />
      )}
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    gap: 21,
    paddingVertical: 21,
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
  rsvpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rsvpCompo: {
    alignItems: 'center',
    gap: 12,
    flex: 1,
    backgroundColor: '#C5B1C33D',
    borderRadius: 20,
    paddingVertical: 24,
  },
});
