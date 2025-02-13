import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import Comment from './component/Comment';
import {
  commentDataForm,
  CommentErrorFormat,
  commentsResponce,
  Comment as CommentType,
  Reply,
} from './commenttypes';
import CommentInput from './component/CommentInput';
import Text from '../../components/Text';
import {storage} from '../../functions/storage';
import {postData} from '../../api';
import Urls from '../../api/urls';
import {useMutation} from '@tanstack/react-query';
import PopupCompo from '../../components/PopupCompo';
const PopupModal = {
  state: false,
  title: '',
  disc: '',
  buttOne: '',
  buttTwo: '',
};
const CommentSection = ({
  eventID,
  guestId,
}: {
  eventID: number;
  guestId: number;
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);

  const [loading, setLoading] = useState(false);

  const [popupModal, setPopupModal] = useState(PopupModal);

  const [allow, setAllow] = useState(false);
  const [showComments,setShowComments] = useState(false)

  useEffect(() => {
    callAPI();
    checkPost();
  }, []);
  const checkPost = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        mode: 'VIEW_EVENT_CONFIG',
        token,
        id,
        event_id: eventID,
      };
      mutationPermission.mutate(formData);
    }
  };
  const mutationPermission = useMutation<
    RSVPResponce,
    ErrorFormat,
    EventDetailsForm
  >({
    mutationFn: (formData: EventDetailsForm) =>
      postData<EventDetailsForm, RSVPResponce>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      // settingsData.guest_posts === 'Y'
      // console.log('check data', data);
      setAllow(data.guest_posts === 'Y' ? true : false);
      setShowComments(data.activity_timeline === 'Y' ? true : false)
    },
    onError: error => {},
  });

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
        mode: 'VIEW_MESSAGES',
        token,
        id,
        event_id: eventID,
      };

      setLoading(true);
      mutation.mutate(formData);
    }
  };
  const mutation = useMutation<
    commentsResponce,
    CommentErrorFormat,
    commentDataForm
  >({
    mutationFn: (formData: commentDataForm) =>
      postData<commentDataForm, commentsResponce>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      // console.log('data', data);
      if (StatusCode === 200 || StatusCode === 404) {
    
        const updatedArr = data.msg_list.map(itm => {
          return {
            id: itm.msg_id,
            text: itm.text,
            image: itm.pic,
            replies: [],
            time: itm.date_time,
            author: {
              name: itm.author.name,
              pic: itm.author.pic,
              rsvp: itm.author.rsvp,
            },
          };
        });
        setComments(updatedArr);
      } else {
        errorPopUp(StatusCode, null);
      }
      setLoading(false);
    },
    onError: error => {
      setLoading(false);
      if (error?.StatusCode === 404) {
    
        setComments([]);
      } else {
        errorPopUp(error?.StatusCode, error?.error?.description);
      }
    },
  });

  const errorPopUp = (code: number, desc: string | null) => {
    setPopupModal({
      state: true,
      title: `Oops! Something went wrong.${code ? ` [${code}]` : ''}`,
      disc: desc
        ? desc
        : "We couldn't complete your request, please try again!",
      buttOne: 'LOGOUT',
      buttTwo: 'RETRY',
    });
  };
  const handleAddComment = (newComment: {
    text: string;
    image: string | null;
  }) => {
    // const comment: CommentType = {
    //   id: comments.length + 1,
    //   text: newComment.text,
    //   image: newComment.image,
    //   replies: [],
    // };
    // setComments([...comments, comment]);
    // console.log('sendMsg', newComment.text, newComment?.image?.length);
    sendMsg(newComment.text, newComment.image);
  };

  const sendMsg = (text: string, image: string | null) => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (
      token !== null &&
      token !== undefined &&
      id !== null &&
      id !== undefined
    ) {
      const formData = {
        mode: 'ADD_MESSAGE',
        token,
        id,
        event_id: eventID,

        guest_id: guestId,
        // parent_id,
        text,
        pic: image,
      };

      setLoading(true);
      mutationSend.mutate(formData);
    }
  };

  const mutationSend = useMutation<
    commentsResponce,
    CommentErrorFormat,
    commentDataForm
  >({
    mutationFn: (formData: commentDataForm) =>
      postData<commentDataForm, commentsResponce>(Urls.EVENT, formData),
    onSuccess: ({data, StatusCode}) => {
      // console.log('data', data);
      if (StatusCode === 200) {
        callAPI();
      } else {
        errorPopUp(StatusCode, null);
      }

      setLoading(false);
    },
    onError: error => {
      // console.log('onError', error);
      setLoading(false);

      errorPopUp(error?.StatusCode, error?.error?.description);
    },
  });

  // const handleAddReply = (commentId: number, replyText: string) => {
  //   const updatedComments = comments.map(comment => {
  //     if (comment.id === commentId) {
  //       const reply: Reply = {
  //         id: comment.replies.length + 1,
  //         text: replyText,
  //         image: null,
  //       };
  //       return {
  //         ...comment,
  //         replies: [...comment.replies, reply],
  //       };
  //     }
  //     return comment;
  //   });
  //   setComments(updatedComments);
  // };

  const onDismiss = useCallback(() => {
    setPopupModal({...popupModal, state: false});
  }, [popupModal.state]);

  const buttOnePress = useCallback(() => {
    if (popupModal.buttOne === 'BACK') {
      setPopupModal({...popupModal, state: false});
    } else {
      setPopupModal({...popupModal, state: false});
    }
  }, [popupModal.state]);

  const buttTwoPress = useCallback(() => {
    if (popupModal.buttOne === 'BACK' && popupModal.buttTwo === 'RETRY') {
      callAPI();
    } else {
      setPopupModal({...popupModal, state: false});
    }
  }, [popupModal.state]);
  return (
    showComments?<View style={styles.container}>
      <Text variant={'SubTitleTwo'} style={{color: '#EDEDED'}}>
        Activity
      </Text>
      {allow && <CommentInput onSubmit={handleAddComment} />}
      {loading && (
        <ActivityIndicator
          color={'#fff'}
          style={{
            marginVertical: 20,
          }}
        />
      )}
      <FlatList
        data={comments}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View>
            <Comment comment={item} />
            {/* <CommentInput
              onSubmit={reply => handleAddReply(item.id, reply.text)}
              isReply
            /> */}
          </View>
        )}
      />

      <PopupCompo
        isVisible={popupModal.state}
        onDismiss={onDismiss}
        title={popupModal.title}
        disc={popupModal.disc}
        buttOne={popupModal.buttOne}
        buttTwo={popupModal.buttTwo}
        buttOnePress={buttOnePress}
        buttTwoPress={buttTwoPress}
      />
    </View>:<View/>
  )
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 8,
  },
});

export default CommentSection;
