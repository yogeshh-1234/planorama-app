export interface SendOTPform {
  mode: string;
  mobile: string;
  otp?: string;
}

export interface registerFormType {
  mode:string
  mobile: string
  name: string
  pic: string
}

export interface CheckNumResponse {
  data: CheckNumData;
  StatusCode: number;
}

export interface CheckNumData {
  newuser: true;
}

export interface VerifyOTPResponse {
  data: {status: boolean};
  StatusCode: number;
}

export interface ErrorFormat {
  error: {
    description: string;
    force_logout?: boolean;
  };
  StatusCode: number;
}

export interface AuthSuccess {
  data: {
    token: string;
    id: string;
  };
  StatusCode: number;
}
