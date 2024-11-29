import React, {memo, useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {BGline} from '../../assets/SVG/VectorSVG';
import Header from './components/Header';
import Text from '../../components/Text';
import {Searchbar} from 'react-native-paper';
import {
  CalenderSVG,
  ClockSVG,
  SearchSVG,
  ThumbsUpSVG,
} from '../../assets/SVG/IconsSVG';

const {width, height} = Dimensions.get('screen');
const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

const paddingHorizontal = width * 0.05;

interface EventType {
  pic: string;
  title: string;
  date: string;
  time: string;
  goingStatus: string;
  eventStatus: string;
  goingList: goingListType[];
  goingListTotal: number;
}
interface goingListType {
  name: string;
  pic: string;
}
const eventList = [
  {
    pic: 'https://s3-alpha-sig.figma.com/img/c9fb/05c9/f9f87fa6736978b3dc687a0538f64b6a?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=KRZ4s5JN1MxAhrzlCQ99jbMyBM5EXDzA0EUInMFLyYWfuPTawTlp-KTM2f2X5pin7YvUdKNhO44M3kd-Pm~oE0BAs8OVrrO0K2p7vitVA~EhprcF9cXRzlQIVWDS4HSmydev5MThECtnG18p3Do5dcwi84MZ9OKLx8mpCDTcasVLbTaoa8Dj~TCTJM~hu4Heoipw0G2TKm5cOblD8ZYheRAQaABCxURwRl6SKJMIBvGWwbNznmYuXqdnflngKT71y2vTbMP9J6kPcIv38pPiJuHULsUsx3GKrSIhhu99uzkw6TAUXKDXI6jlH8eSoTvBjSylslpO~THRRbVaImBEiA__',
    title: 'New Year Celebration',
    date: '31/12/2024',
    time: '20:00',
    goingStatus: 'Y', // Y / N - Yes / No
    eventStatus: 'CLOSED EVENT (N/R. mobile)', // CLOSED EVENT (N/R. mobile)
    goingList: [
      {
        name: 'Chinmay Palekar',
        pic: '',
      },
    ],
    goingListTotal: 1,
  },
  {
    pic: 'https://s3-alpha-sig.figma.com/img/fb7c/a046/cc247627452c7be672f73b7a15272921?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YFwirekgUHmBh1mgMGJCbZYuLWV85QASVI76LpqzO5Qp3VBEJsAvu8ErF14vFmYfUZdLLoaILlwo~utk293H~P5VyUZdzC47hqanXb0lXU1XMbPNg7Tj-eZM0JEuXPXuL9GVFPJTRPbVBemEa~7qmvht626xzAeidm19jzzh61WAEZpiWtl8t5vFiXrm5FjJ4zMAJkvx-k~8b0KzKgIcXfeC21C1-mYG-hjHPC~A1ZPCNbcPVOvY18wI9I0lW4FVusnxJD3MzWlgNhoPEi2ucRVUBOG56BNH0v~tUo~RuTNEfSYVE52HEbq9y0FCQbP20Qpzb8-im6JUR6x~jtqbvA__',
    title: 'XMAS EVE',
    date: '25/12/2024',
    time: '10:30',
    goingStatus: 'N', // Y / N - Yes / No
    eventStatus: 'CLOSED EVENT (Resp. mobile)', // CLOSED EVENT (N/R. mobile)
    goingList: [
      {
        name: 'Chinmay Palekar',
        pic: '',
      },
      {
        name: 'Chinmay Palekar',
        pic: '',
      },
      {
        name: 'Chinmay Palekar',
        pic: '',
      },
    ],
    goingListTotal: 5,
  },
  {
    pic: 'https://s3-alpha-sig.figma.com/img/207e/5493/a9880199d716a0f5c2dcb1449166f613?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Mx1BN0Eta2e7wqZyQl9K~sKdrfLrSjESwZABFoelX4KVhy1muTHn968VOnPBjmOaVgpO1XdTMLnxq66LkcV3ozc9y6Y4OyCXFul6OjPCsHNLBt2I0WR48jERckXGeV1-djaqapPaNRDh9mHRuEK5yoKIzMDXiH1j4VRMr6sJaylSHAKDEgfk9mrdfe1oUcV02X1gDOySUpJYwuPPiJM7f9fE~iz9mOOH50m7bhsm-eBoiK5oLv2~OegGW22KzHbKQld04UTRu43g15Ot27509~zXeb3JX3y2BVlIqsn18b0UWx627xH5KzQhVWmJsj2em4t9mAtKDmtA0M91YuYV~Q__',
    title: 'Birthday Party',
    date: '31/12/2024',
    time: '20:00',
    goingStatus: '', // Y / N - Yes / No
    eventStatus: 'CLOSED EVENT (web)', // CLOSED EVENT (N/R. mobile)
    goingList: [
      {
        name: 'Chinmay Palekar',
        pic: '',
      },
    ],
    goingListTotal: 1,
  },
];
type EventListType = 'your' | 'invited';
type EventTypeText = 'Upcoming' | 'Previous';
export default function () {
  return (
    <View
      style={{
        backgroundColor: '#75486F',
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
      <Header />
      <ScrollView
        contentContainerStyle={{
          paddingTop: height * 0.04,
          paddingBottom: height * 0.04,
          gap: 12,
        }}>
        <WelcomeCompo />
        <SearchCompo />
        <EventsCompo lable={'your'} />
        <EventsCompo lable={'invited'} />
      </ScrollView>
    </View>
  );
}

const EventsCompo = memo(({lable}: {lable: EventListType}) => {
  const [type, setType] = useState<EventTypeText>('Upcoming');
  return (
    <View style={{}}>
      <Text
        style={{
          color: '#fff',
          marginVertical: 8,
          paddingHorizontal,
          textTransform: 'capitalize',
        }}
        variant={'SubTitleTwo'}>
        {lable} Events
      </Text>
      <SelectionRow type={type} setType={setType} total={eventList.length} />
      <EventsDisplay eventList={eventList} type={type} lable={lable} />
    </View>
  );
});

const EventsDisplay = memo(
  ({
    eventList,
    type,
    lable,
  }: {
    eventList: EventType[];
    type: EventTypeText;
    lable: EventListType;
  }) => {
    return (
      <ScrollView
        horizontal={true}
        decelerationRate={0}
        snapToInterval={width * 0.62} //your element width
        snapToAlignment={'center'}
        contentContainerStyle={{
          // gap: 18,
          paddingVertical: 14,
          paddingLeft: paddingHorizontal,
        }}>
        {eventList?.map(item => (
          <EventView
            data={item}
            prev={type === 'Previous'}
            invited={lable === 'invited'}
          />
        ))}
      </ScrollView>
    );
  },
);

const EventView = memo(
  ({
    data,
    prev,
    invited,
  }: {
    data: EventType;
    prev: boolean;
    invited: boolean;
  }) => {
    return (
      <View style={{paddingHorizontal: width * 0.02}}>
        {prev && (
          <Text
            style={{color: '#F9BC52', marginBottom: 4}}
            variant={'BodyBold'}>
            {data.eventStatus}
          </Text>
        )}
        <Image
          source={{uri: data.pic}}
          style={{
            width: width * 0.6,
            height: width * 0.6,
            borderRadius: 10,
            marginVertical: 4,
          }}
        />
        <View
          style={{
            paddingVertical: 4,
            gap: 8,
          }}>
          {invited && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {data.goingList.length > 0 && (
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {data.goingList.map((itm, idx) => (
                      <View
                        style={{
                          width:
                            idx + 1 ===
                            (data.goingList.length > 5
                              ? 5
                              : data.goingList.length)
                              ? 15
                              : 10,
                        }}>
                        <Image
                          source={{
                            uri: `https://avatar.iran.liara.run/username?username=${itm.name.replaceAll(
                              ' ',
                              '+',
                            )}`,
                          }}
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: 15,
                            borderWidth: 0.5,
                            borderColor: '#EDEDED',
                          }}
                        />
                      </View>
                    ))}
                  </View>
                  <Text variant={'DetailRegular'} style={{color: '#fff'}}>
                    {data.goingList[0].name}
                  </Text>
                  {data.goingList.length > 1 && (
                    <Text variant={'DetailRegular'} style={{color: '#fff'}}>
                      +{data.goingList.length - 1} more
                    </Text>
                  )}
                  {/*  */}
                </View>
              )}
            </View>
          )}
          <Text variant={'SubTitleOne'} style={{color: '#fff'}}>
            {data.title}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <CalenderSVG width={16} height={16} />
              <Text variant={'DetailRegular'} style={{color: '#EDEDED'}}>
                {data.date}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <ClockSVG width={16} height={16} />
              <Text variant={'DetailRegular'} style={{color: '#EDEDED'}}>
                {data.time}
              </Text>
            </View>
          </View>
          <StatusCompo goingStatus={data.goingStatus} />
        </View>
      </View>
    );
  },
);



const StatusCompo = memo(({goingStatus}: {goingStatus: string}) => {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF1A',
        borderRadius: 10,
        padding: 10,
        gap: 6,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
      }}>
      {goingStatus === 'Y' && <ThumbsUpSVG width={20} height={20} />}
      {goingStatus === 'N' && <ThumbsUpSVG width={20} height={20} />}
      <Text variant={'BodyRegular'} style={{color: '#fff'}}>
        {goingStatus === 'Y' && 'Going'}
        {goingStatus === 'N' && 'Not Going'}
        {goingStatus === '' && 'Not Responsede Yet'}
      </Text>
    </View>
  );
});

const SelectionRow = memo(
  ({
    type,
    total,
    setType,
  }: {
    type: string;
    total: number;
    setType: (val: EventTypeText) => void;
  }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingVertical: 4,
          paddingHorizontal,
        }}>
        <SelectionItm
          lable={'Upcoming'}
          count={total}
          type={type === 'Upcoming'}
          onPress={() => setType('Upcoming')}
        />
        <SelectionItm
          lable={'Previous'}
          count={total}
          type={type === 'Previous'}
          onPress={() => setType('Previous')}
        />
      </View>
    );
  },
);
const SelectionItm = memo(
  ({
    lable,
    count,
    type,
    onPress,
  }: {
    lable: string;
    count: number;
    type: boolean;
    onPress: () => void;
  }) => {
    return (
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          borderWidth: type ? 1 : 0,
          borderColor: '#fff',
          borderRadius: 1000,
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: '#C5B1C33D',
        }}
        onPress={onPress}>
        <Text variant={'BodyRegular'} style={{color: '#fff'}}>
          {lable}
        </Text>

        <Text variant={'BodyRegular'} style={{color: '#ffffff80'}}>
          {count}
        </Text>
      </Pressable>
    );
  },
);
const WelcomeCompo = memo(() => {
  return (
    <View style={{paddingHorizontal, gap: 12}}>
      <Text variant={'Heading'} style={{color: '#fff'}}>
        Welcome, !
      </Text>
      <Text variant={'DetailBold'} style={{color: '#fff'}}>
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
        sint.
      </Text>
    </View>
  );
});

const SearchCompo = memo(() => {
  const [value, setValue] = useState('');
  return (
    <View style={{paddingHorizontal}}>
      <Searchbar
        style={{
          backgroundColor: '#C5B1C33D',
          borderRadius: 10,
          alignItems: 'center',
          // justifyContent:'center'
        }}
        inputStyle={
          {
            // borderWidth:1,
            // lineHeight:10,
            // height:10
          }
        }
        value={value}
        onChangeText={setValue}
        icon={() => <SearchSVG width={20} height={20} />}
        placeholder="Search"
        placeholderTextColor={'#FFFFFF'}
      />
    </View>
  );
});
