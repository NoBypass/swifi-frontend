import httpClient from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';

export const getSetupStep = async (cookieValue: string): Promise<number> => {
  return (await httpClient.get(API_ENDPOINTS.USER.SETUP_STEP, {
    headers: {
      Cookie: `session=${cookieValue}`,
    }
  })).data.setupStep;
};
