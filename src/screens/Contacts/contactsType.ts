export interface contactViewForm {
  mode: string;
  token: string;
  id: string;
}

export interface contactType {
  id: string | number;
  name: string;
  number: string;
  pic?: null | string;
  country_code?: string;
  rsvp?: string;
  customer_contact?: {
    id: number;
    by_cust_id: number;
  };
}

export interface cantactViewResponse {
  data: {
    contact_list: contactType[];
  };
  StatusCode: number;
}

export interface errorType {
  error: {
    description: string;
  };
  StatusCode: number;
}

export interface importContactForm {
  mode: string;
  token: string;
  id: string;
  contacts: string;
}
export interface importContactResponse {
  data: {
    description: string;
  };
  StatusCode: number;
}

export interface importGuestForm {
  mode: string;
  token: string;
  id: string;
  event_id?: number;
  guests_ids?: string;
  contacts_ids?:string
}

export interface rsvpSubmitForm {
  mode: string;
  token: string;
  id: string;
  event_id: number;
  guest_id: number;
  rsvp: string;
}
