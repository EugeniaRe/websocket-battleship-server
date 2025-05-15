export interface BaseMessage {
  type: string;
  data: RegistrationData;
}

export interface RegistrationMessage {
  type: string;
  data: {
    name: string;
    password: string;
  };
}

export interface RegistrationData {
  name: string;
  password: string;
}

export interface RegistrationResponse {
  type: "reg";
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
}

export interface RegistrationResponseData {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
}
