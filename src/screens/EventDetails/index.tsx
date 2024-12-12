import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StatusBar, View} from 'react-native';
import {storage} from '../../functions/storage';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation';
import {useMutation} from '@tanstack/react-query';
import {
  ErrorFormat,
  EventDetailsForm,
  EventDetailsType,
  EventResponse,
} from './EveDetType';
import {postData} from '../../api';
import Urls from '../../api/urls';
import DetailsCompo from './DetailsCompo';
import LoadingCompo from '../../components/LoadingCompo';
const {width, height} = Dimensions.get('screen');
const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
export default function () {
  const [loading, setLoading] = useState(false);
  const [popupModal, setPopupModal] = useState(PopupModal);

  const {params} = useRoute<RouteProp<RootStackParamList, 'EventDetails'>>();

  const [eventData, setEventData] = useState<EventDetailsType>({
    id: -1,
    cover_img: '',
    bg_img: '',
    name: '',
    color_hex: '',
    font_id: '',
    date: '',
    time: '',
    type: '',
    location: '',
    link: '',
    event_disc: '',
    rsvp: null,
  });

  useEffect(() => {
    callAPI();
  }, []);

  const callAPI = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        mode: 'VIEW_EVENT',
        token,
        id,
        event_id: params.id,
      };
      setLoading(true);

      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<EventResponse, ErrorFormat, EventDetailsForm>({
    mutationFn: (formData: EventDetailsForm) =>
      postData<EventDetailsForm, EventResponse>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        //
        setEventData(data);
        //
      } else {
        setPopupModal({
          state: true,
          title: `Oops! Something went wrong.${
            StatusCode ? ` [${StatusCode}]` : ''
          }`,
          disc: "We couldn't complete your request, please try again!",
          buttOne: 'LOGOUT',
          buttTwo: 'RETRY',
        });
      }
      setLoading(false);
    },
    onError: error => {
      setLoading(false);

      setPopupModal({
        state: true,
        title: `Oops! Something went wrong.${
          error?.StatusCode ? ` [${error.StatusCode}]` : ''
        }`,
        disc: error?.error?.description
          ? error.error.description
          : "We couldn't complete your request, please try again!",
        buttOne: 'LOGOUT',
        buttTwo: 'RETRY',
      });
    },
  });

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
      <ScrollView
        contentContainerStyle={{
          paddingTop: height * 0.03,
          paddingBottom: height * 0.04,
          paddingHorizontal: width * 0.05,
          //   gap: 12,
        }}>
        <DetailsCompo
          title={eventData.name}
          fontId={eventData.font_id.toString()}
          cover_img={eventData.cover_img}
          bg_img={eventData.bg_img}
          colorHex={eventData.color_hex}
          date={eventData.date}
          time={eventData.time}
          location={eventData.location}
          description={eventData.event_disc}
          rsvp={eventData.rsvp}
          gallery={[]}
        />
      </ScrollView>
      {loading&&<LoadingCompo text={"Getting event details"} />}
    </View>
  );
}
