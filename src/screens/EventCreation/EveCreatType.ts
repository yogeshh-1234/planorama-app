export interface eventItemType {
  mode: string;
  token: string;
  id: string;
  title: string;
  fontId: string;
  cover_img: string;
  bg_img: string;
  colorHex: string;
  date: string;
  time: string;
  type: string;
  location: string;
  link: string;
  eventHostIds: string;
  eventDisc: string;
  rsvp: 'Y' | 'N' | 'M' | '' | null;
  event_id: number | null;
}
export interface galleryForm {
  mode: string;
  token: string;
  id: string;
  event_id: number;
  gallery: string;
}
export interface eventError {
  error: {
    description: string;
  };
  StatusCode: number;
}

export interface eventSucccess {
  data: {
    description: string;
    event_id: number;
  };
  StatusCode: number;
}
