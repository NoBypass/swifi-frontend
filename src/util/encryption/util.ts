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

export function binaryToBase64(buf: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

export function base64ToBinary(str: string): ArrayBuffer {
    return Uint8Array.from(atob(str), c => c.charCodeAt(0)).buffer;
}
