import httpClient from '../httpClient';
import API_ENDPOINTS from "@/api/endoints";
import {User} from "@/model/user";

export const getSetupStep = async (): Promise<number> => {
  return (await httpClient.get(API_ENDPOINTS.USER.SETUP_STEP)).data.setupStep;
};

export const getAuthenticationOpts = async (email: string): Promise<{ salt: string }> => {
  return (await httpClient.get(API_ENDPOINTS.AUTH.AUTHENTICATION_OPTIONS, {
    params: {
      mode: email ? 'password' : 'webauthn',
      email,
    }
  })).data;
}

export const authenticate = async (hash: string): Promise<User> => {
  return (await httpClient.post(API_ENDPOINTS.AUTH.AUTHENTICATE, {
    mode: 'password',
    stayLogged: false,
    password: {
      hash,
    }
  }))
}
