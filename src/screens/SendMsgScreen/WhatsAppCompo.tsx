import React, {memo, useEffect, useState} from 'react';
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {
  connectionForm,
  connectionResponce,
  profileError,
} from '../Profile/ProfileTypes';
import Urls from '../../api/urls';
import {postData} from '../../api';
import {Pressable} from 'react-native';
import WhatsAppLogo from '../../components/WhatsAppLogo';

export default memo(() => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  useEffect(() => checkWhatsappStatus(), []);
  const checkWhatsappStatus = () => {

    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (token && id) {
      const formData = {
        mode: 'CHECK_CONNECTION',
        token,
        id,
      };
      setLoading(true);
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation<
    connectionResponce,
    profileError,
    connectionForm
  >({
    mutationFn: (formData: connectionForm) =>
      postData<connectionForm, connectionResponce>(Urls.WHATSAPP, formData),
    onSuccess: ({data: {status}}) => {
      setStatus(status);
      setLoading(false);
    },
    onError: () => {
      setStatus(false);
      setLoading(false);
    },
  });
  return (
    <Pressable onPress={checkWhatsappStatus}>
      <WhatsAppLogo loading={loading} connected={status} />
    </Pressable>
  );
});
