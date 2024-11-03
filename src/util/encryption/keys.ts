import {createEncryptionIvPair, splitEncryptionIvPair} from "@util/encryption/iv";

export async function deriveKey(value: BufferSource, salt: Uint8Array) {
    const baseKey = await crypto.subtle.importKey(
        'raw', value, { name: 'PBKDF2' }, false, ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        {
            name: 'AES-GCM',
            length: 256
        },
        false,
        ['encrypt', 'decrypt']
    );
}

export async function encryptAESKey(derivedKey: CryptoKey, aesKey: ArrayBuffer) {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedAESKey = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        derivedKey,
        aesKey
    );

    return createEncryptionIvPair(new TextDecoder().decode(encryptedAESKey), new TextDecoder().decode(iv));
}

export async function decryptAESKey(derivedKey: CryptoKey, encryptionIvPair: string) {
    const { encryptedData, iv } = splitEncryptionIvPair(encryptionIvPair);


    const decryptedArrayBuffer = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: new TextEncoder().encode(iv)
        },
        derivedKey,
        new TextEncoder().encode(encryptedData)
    );

    return await crypto.subtle.importKey(
        'raw',
        decryptedArrayBuffer,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
    );
}

export async function encryptData(aesKey: CryptoKey, data: string) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encryptedData = new TextDecoder().decode(await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        aesKey,
        encodedData
    ));

    return createEncryptionIvPair(encryptedData, new TextDecoder().decode(iv));
}

export async function decryptData(aesKey: CryptoKey, encryptionIvPair: string) {
    const { encryptedData, iv } = splitEncryptionIvPair(encryptionIvPair);
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: new TextEncoder().encode(iv)
        },
        aesKey,
        new TextEncoder().encode(encryptedData)
    );

    return new TextDecoder().decode(decryptedData);
}

export async function generateAESKey() {
    const key = await crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
    );

    return crypto.subtle.exportKey('raw', key);
}

export async function generateSalt(length: number) {
    return crypto.getRandomValues(new Uint8Array(length));
}

export async function hashSHA256(data: string) {
    const encodedData = new TextEncoder().encode(data);
    return await crypto.subtle.digest('SHA-256', encodedData);
}
