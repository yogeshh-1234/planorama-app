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

export interface EventGalleryResponse {
  data: {
    id: number;
    gallery: galleryType[];
    count: number;
  };
  StatusCode: number;
}

export interface galleryType {
  id: string;
  pic: string;
}

export interface RSVPResponce {
  data: RSVPResponceData;
  StatusCode: number;
}

export interface RSVPResponceData {
  id: number;
  accept_rsvp: 'Y' | 'N';
  accept_maybe: 'Y' | 'N';
  rsvp_button_style: number;
  show_count_guests: 'Y' | 'N';
  open_event: 'Y' | 'N';
  max_capacity: number;
  guest_approval: 'Y' | 'N';
  additional_guests: number;
  activity_timeline: 'Y' | 'N';
  guest_status_share: 'Y' | 'N';
  guest_posts: 'Y' | 'N';
  guest_upload: 'Y' | 'N';
}

export interface RSVPSubmitForm {
  mode: string;
  token: string;
  id: string;
  event_id: number;
  accept_rsvp: string;
  accept_maybe: string;
  rsvp_button_style: number;
  show_count_guests: string;
  open_event: string;
  max_capacity: number;
  guest_approval: string;
  additional_guests: number;
  activity_timeline: string;
  guest_status_share: string;
  guest_posts: string;
  guest_upload: string;
}

export interface sendRSVPSuccess {
  data: {
    description: string;
  };
  StatusCode: number;
}
