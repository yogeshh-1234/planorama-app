export interface EventDetailsForm {
  mode: string;
  token: string;
  id: string;
  event_id: number;
}

export interface EventResponse {
  data: EventDetailsType;
  StatusCode: number;
}
export interface EventDetailsType {
  id: number;
  cover_img: string;
  bg_img: string;
  name: string;
  color_hex: string;
  font_id: string | number;
  date: string;
  time: string;
  type: string;
  location: string;
  link: string;
  event_disc: string;
  rsvp: 'Y' | 'N' | 'M' | null;
}
export interface ErrorFormat {
  error: {
    description: string;
    force_logout?: boolean;
  };
  StatusCode: number;
}
