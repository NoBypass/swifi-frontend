import httpClient from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';
import type { Label } from '@model/label.ts';

export const addLabel = async (label: Label): Promise<void> => {
  await httpClient.post(API_ENDPOINTS.LABEL, label);
};

export const getAllLabels = async (): Promise<Label[]> => {
  return (await httpClient.get<Label[]>(API_ENDPOINTS.LABEL)).data;
}
