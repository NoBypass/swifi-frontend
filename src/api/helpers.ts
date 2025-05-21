export const getAesKey = (): string => {
  const aesKey = localStorage.getItem('aesKey');
  if (!aesKey) {
    throw new Error('AES key not found in local storage');
  }
  return aesKey;
};