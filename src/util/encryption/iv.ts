import {base64ToBinary, binaryToBase64} from "@util/encryption/util";

export function createEncryptionIvPair(encryptedData: ArrayBuffer, iv: ArrayBuffer): string {
    return `${binaryToBase64(encryptedData)}.${binaryToBase64(iv)}`;
}

export function splitEncryptionIvPair(pair: string): { encryptedData: ArrayBuffer, iv: ArrayBuffer } {
    const [encryptedData, iv] = pair.split('.');
    return {
        encryptedData: base64ToBinary(encryptedData),
        iv: base64ToBinary(iv)
    };
}
