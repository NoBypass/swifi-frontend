import {asBase64url, fixBase64url} from "@util/encryption/util";

const apiUrl = import.meta.env.PUBLIC_API_URL;

export type PublicKeyCredentialWithTransports = PublicKeyCredential & {
    response: AuthenticatorAttestationResponse;
    transports?: string[];
};

export type PublicKeyCredentialWithAssertion = PublicKeyCredential & {
    response: AuthenticatorAssertionResponse;
};

export type LoginResponse = {
    id: string
    rawId: string
    type: string
    response: {
        clientDataJSON: string
        authenticatorData: string
        signature: string
        userHandle: string | null
    }
}

export type RegistrationResponse = {
    id: string
    rawId: string
    type: string
    response: {
        clientDataJSON: string
        attestationObject: string
    }
}

export function parseLoginAssertion(assertion: PublicKeyCredentialWithAssertion): LoginResponse {
    return {
        id: assertion.id,
        rawId: asBase64url(assertion.rawId),
        type: assertion.type,
        response: {
            clientDataJSON: asBase64url(assertion.response.clientDataJSON),
            authenticatorData: asBase64url(assertion.response.authenticatorData),
            signature: asBase64url(assertion.response.signature),
            userHandle: assertion.response.userHandle ? asBase64url(assertion.response.userHandle) : null
        }
    }
}

export function parseSignupCredential(credential: PublicKeyCredentialWithTransports): RegistrationResponse {
    return {
        id: credential.id,
        rawId: asBase64url(credential.rawId),
        type: credential.type,
        response: {
            clientDataJSON: asBase64url(credential.response.clientDataJSON),
            attestationObject: asBase64url(credential.response.attestationObject)
        }
    }
}

export function parseSignupOptions(options: any): PublicKeyCredentialCreationOptions {
    options.challenge = Uint8Array.from(atob(fixBase64url(options.challenge)), c => c.charCodeAt(0));
    options.user.id = Uint8Array.from(atob(fixBase64url(options.user.id)), c => c.charCodeAt(0));
    if (options.extensions?.prf?.eval?.first) {
        options.extensions.prf.eval.first = new TextEncoder().encode(options.extensions.prf.eval.first);
    }
    return options;
}

export function parseLoginOptions(options: any): any {
    options.challenge = Uint8Array.from(atob(fixBase64url(options.challenge)), c => c.charCodeAt(0));
    if (options.extensions?.prf?.eval?.first) {
        options.extensions.prf.eval.first = new TextEncoder().encode(options.extensions.prf.eval.first);
    }
    return options;
}

export async function logout(): Promise<Response> {
    return fetch(`${apiUrl}/auth/logout`, {
        credentials: "include",
    });
}

type Safe = {
    salt: string,
    data: string
}

type EncryptionSetup = {
    token: Safe,
    tokenEncryptedKey: Safe,
    passkeyEncryptedKey: Safe
}

export async function getRegistrationOptions(mode: 'pass'): Promise<{ salt: string }>;
export async function getRegistrationOptions(mode: 'key'): Promise<PublicKeyCredentialCreationOptions>;
export async function getRegistrationOptions(mode: 'pass' | 'key'): Promise<PublicKeyCredentialCreationOptions | { salt: string }> {
    const response = await fetch(`${apiUrl}/auth/registration-options?mode=${mode}`, {
        credentials: "include"
    });
    const data = await response.json();
    if (mode === 'pass') {
        return data;
    } else {
        return parseSignupOptions(data);
    }
}

export async function register(data: {
    encryptedKey: number[],
    credential: RegistrationResponse,
} | {
    encryptedKey: number[],
    hash: number[]
    email: string,
}, stayLoggedIn: boolean): Promise<Response> {
    let mode: 'key' | 'pass';
    if ("credential" in data) {
        mode = 'key';
    } else {
        mode = 'pass';
    }

    return fetch(`${apiUrl}/auth/register?stayLogged=${stayLoggedIn}&mode=${mode}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

export async function getAuthenticationOptions(): Promise<PublicKeyCredentialRequestOptions> {
    const response = await fetch(`${apiUrl}/auth/authentication-options`, {
        credentials: "include"
    });
    return parseLoginOptions(await response.json());
}
