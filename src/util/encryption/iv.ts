export function createEncryptionIvPair(encryptedData: string, iv: string): string {
    return `${encryptedData}.${iv}`;
}

export function splitEncryptionIvPair(pair: string): { encryptedData: string, iv: string } {
    const [encryptedData, iv] = pair.split('.');
    return { encryptedData, iv };
}