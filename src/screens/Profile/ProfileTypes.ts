export interface logoutForm {
  mode: string;
  token: string;
}
export interface logoutResponse {
  data: {};
  StatusCode: number;
}

export interface profileError {
  error: {
    description: string;
  };
  StatusCode: number;
}

export interface connectionForm {
  mode: string;
  token: string;
  id: string;
}
export interface connectionResponce {
  data: {
    description: string;
    status: boolean;
    interval: number;
    instance: {
      credits: number;
    };
  };
  StatusCode: number;
}

export interface mailQRForm {
  mode: string;
  token: string;
  id: string;
  email: string;
}
export interface mailQRResponce {
  data: {
    description: string;
  };
  StatusCode: number;
}

export interface WAmessageResponse {
  data: {
    description: string;
    msg_tpl: string;
  };
  StatusCode: number;
}

export interface updateProfForm {
  mode: string;
  token: string;
  id: string;
  name: string;
  pic: string | null;
}
