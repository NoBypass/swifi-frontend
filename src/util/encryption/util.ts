export type PRFExtension = PRFExtensionWithResults | {
    prf: {
        enabled: boolean
    }
} | {} | null

export function supportsPRF(extension: PRFExtension): boolean {
    return !!extension && 'prf' in extension && 'enabled' in extension.prf && extension.prf.enabled;
}

export type PRFExtensionWithResults = {
    prf: {
        results: {
            first: ArrayBuffer,
            second?: ArrayBuffer
        }
    }
}

export function asBase64url(buf: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}

export function fixBase64url(input: string): string {
    input = input.replace(/-/g, '+').replace(/_/g, '/');
    while (input.length % 4) {
        input += '=';
    }
    return input;
}

export function base64ToBinary(str: string): ArrayBuffer {
    return Uint8Array.from(atob(str), c => c.charCodeAt(0)).buffer;
}

export async function exportKey(key: CryptoKey): Promise<string> {
    const rawKey = await crypto.subtle.exportKey("raw", key);
    return btoa(String.fromCharCode(...new Uint8Array(rawKey)));
}

export async function importKey(base64Key: string): Promise<CryptoKey> {
    const rawKey = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    return crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );
}

export async function deriveAESKey(base: string, iv: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(base),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: iv, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
}
