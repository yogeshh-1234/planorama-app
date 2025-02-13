import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import {Comment as CommentType} from '../commenttypes';
import {HostedByCompo, ImageCompo} from '../DetailsCompo';
import Text from '../../../components/Text';
import AutherCompo from './AutherCompo';

const {width} = Dimensions.get('screen');
interface CommentProps {
  comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({comment}) => {
  // console.log(comment);
  return (
    <View style={styles.commentContainer}>
      {/* <HostedByCompo hostList={[]} /> */}
      <AutherCompo
        uri={comment.author.pic ? comment.author.pic : ''}
        name={comment.author.name}
        rsvp={comment.author.rsvp}
        time={comment.time}
      />
      <View
        style={{
          paddingLeft: 50,
          // borderWidth: 1,
          // borderColor: 'red',
          gap: 8,
        }}>
        {comment.image && (
          // <Image source={{uri: comment.image}} style={styles.commentImage} />
          <ImageCompo
                            uri={comment.image}
                            ImgSize={width * 0.4}
                          />
        )}
        {comment.text && (
          <Text variant={'DetailRegular'} style={styles.commentText}>
            {comment.text}
          </Text>
        )}

        {/* Render Replies */}
        {comment.replies.map(reply => (
          <View key={reply.id} style={styles.replyContainer}>
            <Text style={styles.replyText}>{reply.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    marginTop: 10,
    // padding: 10,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 5,
    gap: 8,
  },
  commentText: {
    color: '#EDEDED',
  },
  commentImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 10,
  },
  replyContainer: {
    marginLeft: 20,
    marginTop: 5,
    padding: 5,
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
  },
  replyText: {
    fontSize: 14,
    color: '#555',
  },
});

export default Comment;
