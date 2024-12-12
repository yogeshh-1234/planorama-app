export interface dashFormType {
  mode: string;
  token: string;
  id: string;
}

export interface eventItem {
  evt_id: number;
  pic: null | string;
  title: string;
  date: string;
  time: string;
  goingStatus: string;
}

export interface dashEventsResponse {
  data: {
    event_list: eventItem[];
  };
  StatusCode: number;
}

export interface dashError {
  error: {
    description: string;
  };
  StatusCode: number;
}

export interface profileResponse {
  data: {
    id: string;
    pic: string;
    name: string;
    country_code: string;
    number: string;
  };
  StatusCode: number;
}
