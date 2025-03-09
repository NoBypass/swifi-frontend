import { deriveAESKey, exportKey, importKey } from '@util/encryption/util.ts';

export async function generateAESKey(): Promise<string> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  return exportKey(key);
}

export async function encryptAESKey(base: string, keyBase64: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const baseDerivedKey = await deriveAESKey(base, iv);
  const encryptedKey = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    baseDerivedKey,
    Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0))
  );
  return `${btoa(String.fromCharCode(...new Uint8Array(encryptedKey)))}.${btoa(String.fromCharCode(...iv))}`;
}

export async function decryptAESKey(base: string, encryptedKeyStr: string): Promise<string> {
  const [encryptedKeyBase64, ivBase64] = encryptedKeyStr.split(".");
  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  const baseDerivedKey = await deriveAESKey(base, iv);
  const decryptedKeyBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    baseDerivedKey,
    Uint8Array.from(atob(encryptedKeyBase64), c => c.charCodeAt(0))
  );
  return btoa(String.fromCharCode(...new Uint8Array(decryptedKeyBuffer)));
}

export async function encryptData(data: string, keyBase64: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await importKey(keyBase64);
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(data)
  );
  return `${btoa(String.fromCharCode(...new Uint8Array(encryptedData)))}.${btoa(String.fromCharCode(...iv))}`;
}

export async function decryptData(encryptedDataStr: string, keyBase64: string): Promise<string> {
  const [encryptedDataBase64, ivBase64] = encryptedDataStr.split(".");
  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  const key = await importKey(keyBase64);
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    Uint8Array.from(atob(encryptedDataBase64), c => c.charCodeAt(0))
  );
  return new TextDecoder().decode(decryptedBuffer);
}