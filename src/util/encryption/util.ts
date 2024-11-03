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

export async function keyToString(key: CryptoKey) {
    return new TextDecoder().decode(await crypto.subtle.exportKey('raw', key));
}

export async function stringToKey(key: string) {
    return crypto.subtle.importKey('raw', new TextEncoder().encode(key), 'PBKDF2', false, ['deriveKey']);
}

function generateAlphanumericToken(): string {
    const length = 24;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const array = new Uint8Array(length-2);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        if (i === 8 || i === 16) {
            result += '-';
        }
        result += chars.charAt(array[i] % chars.length);
    }
    return result;
}

export async function generateRecoveryToken(): Promise<{
    salt: string,
    token: string,
    hash: string
}> {
    const salt = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
    const token = generateAlphanumericToken();
    const hash = await hashData(token, salt);
    return { salt, token, hash };
}

export function hashData(data: string, salt: string): Promise<string> {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(data + salt))
        .then(hash => btoa(String.fromCharCode(...new Uint8Array(hash))))
}
