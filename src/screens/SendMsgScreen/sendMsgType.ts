export interface getMsgForm {
  mode: string;
  token: string;
  id: string;
  event_id: number;
}
export interface getMsgResponse {
  data: getMsgDataType;
  StatusCode: number;
}
type ShortcodeType = {
  [key: string]: string; // Allows additional keys with string values
};

export type getMsgDataType = {
  shortcode: ShortcodeType;
  file_type_ext: {
    IMG: string[];
    VID: string[];
    DOC: string[];
  };
  message_template: string;
  rsvp_url: string;
};
export interface getMsgError {
  error: {
    description: string;
  };
  StatusCode: number;
}

export interface msgFormType {
  mode: string;
  token: string;
  id: string;
  event_id: number;
  guests_ids: string;
  message: string;
  file_base64: string;
  file_name: string;
}

export interface msgSendResponce {
  data: {
    description: string;
    msg_send_guest_cnt: number;
  };
  StatusCode: number;
}
