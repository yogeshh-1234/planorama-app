// types.ts
export interface Reply {
  id: string;
  text: string;
  time: string;
  // image: string | null; // Replies can only be text, but keeping it consistent
}

export interface Comment {
  id: string;
  text: string;
  image: string | null; // Can be null if no image
  replies: Reply[];
  time: string;
  author: {
    name: string;
    pic: string | null;
    rsvp: string;
  };
}

export interface CommentInputProps {
  onSubmit: (comment: {text: string; image: string | null}) => void;
  isReply?: boolean;
}

export interface commentsResponce {
  data: commentsAPIData;
  StatusCode: number;
}

export interface commentDataForm {
  mode: string;
  token: string;
  id: string;
  event_id: number;
}

export interface commentsAPIData {
  msg_list: comentItm[];
}

export interface comentItm {
  msg_id: '1';
  date_time: '12/02/25 03:50 pm';
  text: 'Some message text HERE';
  pic: null;
  author: {
    name: '';
    pic: null;
    rsvp: '';
  };
  msg_reply: [];
}



export interface CommentErrorFormat {
  error: {
    description: string;
    force_logout?: boolean;
  };
  StatusCode: number;
}

