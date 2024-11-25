import {createEncryptionIvPair, splitEncryptionIvPair} from "@util/encryption/iv";
import {base64ToBinary, binaryToBase64} from "@util/encryption/util";

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

    let u = new Uint8Array(encryptedAESKey);

    return {
        encryptedKey: Array.from(u),
        iv: Array.from(iv)
    }
}

export async function decryptAESKey(derivedKey: CryptoKey, encryptionIvPair: string) {
    const { encryptedData, iv } = splitEncryptionIvPair(encryptionIvPair);

    const decryptedArrayBuffer = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        derivedKey,
        encryptedData
    );

    return await crypto.subtle.importKey(
        'raw',
        decryptedArrayBuffer,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
    );
}

export async function encrypt(aesKey: CryptoKey, data: string) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encryptedData = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        aesKey,
        encodedData
    );

    return createEncryptionIvPair(encryptedData, iv);
}

export async function decrypt(aesKey: CryptoKey, encryptionIvPair: string) {
    const { encryptedData, iv } = splitEncryptionIvPair(encryptionIvPair);
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        aesKey,
        encryptedData
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

export async function hashSHA256(data: string, salt: string) {
    const encodedData = new TextEncoder().encode(data + salt);
    return await crypto.subtle.digest('SHA-256', encodedData);
}

export async function readEncryptionKey() {
    const key = getKey();

    return await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
    );
}

export function saveKey(key: ArrayBuffer) {
    localStorage.setItem("encryptionKey", binaryToBase64(key));
}

export function getKey(): ArrayBuffer {
    const key = localStorage.getItem("encryptionKey");
    if (!key) {
        throw new Error("No encryption key found in localStorage");
    }
    return base64ToBinary(key);
}
