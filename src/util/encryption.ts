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

export async function generateRecoveryToken(): Promise<{
    salt: string,
    token: string,
    hash: string
}> {
    const salt = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
    const token = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
    const hash = await hashData(token, salt);
    return { salt, token, hash };
}

export function hashData(data: string, salt: string): Promise<string> {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(data + salt))
        .then(hash => btoa(String.fromCharCode(...new Uint8Array(hash))))
}
