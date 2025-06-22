import httpClient from '../httpClient';
import API_ENDPOINTS from "@/api/endoints";
import {User} from "@/model/user";

export const getStatus = async (): Promise<{
  setupStep: number;
  sentKey: boolean;
}> => {
  return (await httpClient.get(API_ENDPOINTS.USER.STATUS)).data;
};

export const getAuthenticationOpts = async (email: string): Promise<{ salt: string }> => {
  return (await httpClient.get(API_ENDPOINTS.AUTH.AUTHENTICATION_OPTIONS, {
    params: {
      method: email ? 'email' : 'webauthn',
      email,
    }
  })).data;
}

type AuthenticationProps = {
  method: 'email',
  hash: string
} | {
  otp: string
}

export const authenticate = async (props: AuthenticationProps): Promise<{ encryptionKey: string } | null> => {
  let data: any = {}
  if ('otp' in props) {
    data.otp = props.otp
  } else {
    data.password = { hash: props.hash }
  }

  return (await httpClient.post(API_ENDPOINTS.AUTH.AUTHENTICATE, {
    method: 'method' in props ? props.method : 'otp',
    ...data
  })).data;
}
