import httpClient from '../httpClient';
import { API_ENDPOINTS } from '../endpoints';
import { decryptData, encryptData } from '@util/encryption/key.ts';
import { getAesKey } from '@api_v2/helpers.ts';
import type { CapitalSource, CapitalSourceResponse } from '@model/capitalSource.ts';

export const createCapitalSource = async (capitalSource: CapitalSource): Promise<void> => {
  const aesKey = getAesKey()

  const encryptedInitialBalance = await encryptData(capitalSource.initialBalance.toString(), aesKey);
  return await httpClient.post(API_ENDPOINTS.CAPITAL_SOURCE, {
    ...capitalSource,
    initialBalance: encryptedInitialBalance,
  });
};

export const getAllCapitalSources = async (): Promise<CapitalSource[]> => {
  const response = await httpClient.get<CapitalSourceResponse[]>(API_ENDPOINTS.CAPITAL_SOURCE);
  const aesKey = getAesKey()

  return await Promise.all(
    response.data.map(async (capitalSource): Promise<CapitalSource> => {
      return {
        ...capitalSource,
        initialBalance: Number(await decryptData(capitalSource.initialBalance, aesKey)),
      };
    })
  );
}
