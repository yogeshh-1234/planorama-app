export interface EventGuestsForm {
  mode: string;
  token: string;
  id: string;
  event_id: number;
}

export interface GuestEventResponseData {
  guest_list: guestItemType[];
    rsvp_cnt: {
      [key: string]: number;
    };
    INVITE_RSVP_DD_ARR: Array<{
      id: string;
      name: string;
    }>;
}

export interface GuestEventResponse {
  data: GuestEventResponseData
  StatusCode: number;
}

export interface guestItemType {
  id: number;
  name: string;
  country_code: string;
  number: string;
  pic: string;
  rsvp: string;
  customer_contact: {
    id: number;
    by_cust_id: number;
  };
  rsvp_status: '';
  rsvp_invited: '';
}

export interface ErrorFormat {
  error: {
    description: string;
    force_logout?: boolean;
  };
  StatusCode: number;
}
