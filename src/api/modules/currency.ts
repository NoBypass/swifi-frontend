import type { Currency } from '@model/currency.ts';
import httpClient from '@api_v2/httpClient.ts';
import { API_ENDPOINTS } from '@api_v2/endpoints.ts';

export const getAllCurrencies = async (): Promise<Currency[]> => {
  return (await httpClient.get<Currency[]>(API_ENDPOINTS.STATIC.CURRENCIES)).data
}