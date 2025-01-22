export interface EventGuestsForm {
  mode: string;
  token: string;
  id: string;
  event_id: number;
}

export interface GuestEventResponse {
  data: {
    guest_list: guestItemType[];
  };
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
}

export interface ErrorFormat {
  error: {
    description: string;
    force_logout?: boolean;
  };
  StatusCode: number;
}
