import React, {useCallback, useState} from 'react';
import Button from '../../../components/Button';
import {WASVG} from '../../../assets/SVG/IconsSVG';
import {storage} from '../../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {getMsgError, msgFormType, msgSendResponce} from '../sendMsgType';
import Urls from '../../../api/urls';
import {postData} from '../../../api';
import PopupCompo from '../../../components/PopupCompo';
import Loading from '../../../components/Loading';
import LoadingCompo from '../../../components/LoadingCompo';
import {MainStackNavigation} from '../../../navigation';
import {useNavigation} from '@react-navigation/native';
const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
export default function ({
  lable,
  event_id,
  guests_ids,
  message,
  count,
  eventName,
  eventPic,
}: {
  lable: string;
  event_id: number;
  guests_ids: string;
  message: string;
  count: number;
  eventName: string;
  eventPic: string;
}) {
  const navigation = useNavigation<MainStackNavigation>();
  const [loading, setLoading] = useState(false);
  const [popupModal, setPopupModal] = useState(PopupModal);

  const handleSend = async () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      try {
        // Fetch the image
        const response = await fetch(eventPic);
        const contentType = response.headers.get('Content-Type') || 'image/png'; // Fallback to PNG if Content-Type is not provided
        const blob = await response.blob();

        // Convert blob to Base64 using FileReader wrapped in a Promise
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = (reader.result as string).replace(
              /^data:application\/octet-stream/,
              `data:${contentType}`,
            ); // Replace the default MIME type if necessary
            resolve(base64Data);
          };
          reader.onerror = error => reject(error);
          reader.readAsDataURL(blob);
        });

        const imageName = eventPic.split('/').pop();

        const formData = {
          mode: 'SEND_MESSAGE',
          token,
          id,
          event_id,
          guests_ids,
          message,
          file_base64: base64,
          file_name: imageName ? imageName : '',
        };
        
        setLoading(true);
        mutation.mutate(formData);
      } catch (error) {
        console.error('Error converting image to Base64:', error);
      }
    }
  };

  const mutation = useMutation<msgSendResponce, getMsgError, msgFormType>({
    mutationFn: (formData: msgFormType) =>
      postData<msgFormType, msgSendResponce>(Urls.WHATSAPP, formData),
    onSuccess: ({data, StatusCode}) => {
      StatusCode === 200
        ? navigation.navigate('SuccessScreen', {
            type: 'invite',
            count: count,
            title: 'string',
            eventID: event_id,
            eventName,
          })
        : errorPopUp(StatusCode, null);
      setLoading(false);
    },
    onError: error => errorPopUp(error?.StatusCode, error?.error?.description),
  });

  const errorPopUp = (code: number, desc: string | null) => {
    setLoading(false);
    setPopupModal({
      state: true,
      title: `Oops! Something went wrong.${code ? ` [${code}]` : ''}`,
      disc: desc
        ? desc
        : "We couldn't complete your request, please try again!",
      buttOne: '',
      buttTwo: 'OKAY',
    });
  };
  const onDismiss = () => setPopupModal({...popupModal, state: false});

  return (
    <>
      <Button
        variant="SubTitleOne"
        textStyles={{
          color: '#2D2D2D',
        }}
        buttonStyles={{
          backgroundColor: '#F9BC52',
        }}
        lable={lable}
        onPress={handleSend}
        icon={() => <WASVG width={24} height={24} />}
        loading={loading}
        disabled={loading}
      />
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
}
