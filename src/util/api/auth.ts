import {asBase64url, fixBase64url} from "@util/encryption/util";

const apiUrl = import.meta.env.PUBLIC_API_URL;

export type PublicKeyCredentialWithTransports = PublicKeyCredential & {
    response: AuthenticatorAttestationResponse;
    transports?: string[];
};

export type PublicKeyCredentialWithAssertion = PublicKeyCredential & {
    response: AuthenticatorAssertionResponse;
};

export type AuthenticationResponse = {
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

export function parseLoginAssertion(assertion: PublicKeyCredentialWithAssertion): AuthenticationResponse {
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

export async function getRegistrationOptions(mode: 'pass', email: string): Promise<{ salt: string }>;
export async function getRegistrationOptions(mode: 'key', email: string): Promise<PublicKeyCredentialCreationOptions>;
export async function getRegistrationOptions(mode: 'pass' | 'key', email: string): Promise<PublicKeyCredentialCreationOptions | { salt: string }> {
    const response = await fetch(`${apiUrl}/auth/registration-options?mode=${mode}&email=${email}`, {
        credentials: "include"
    });
    const data = await response.json();
    if (mode === 'pass') {
        return data;
    } else {
        return parseSignupOptions(data);
    }
}

type PasswordRegistration = {
    encryptedKey: number[],
    iv: number[],
    hash: number[],
}

export async function register(data: PublicKeyCredentialWithTransports | PasswordRegistration, stayLoggedIn: boolean): Promise<Response> {
    let mode: 'key' | 'pass';
    let sendingData: RegistrationResponse | PasswordRegistration;
    if ("hash" in data) {
        mode = 'pass';
        sendingData = data;
    } else {
        mode = 'key';
        sendingData = parseSignupCredential(data);
    }

    return fetch(`${apiUrl}/auth/register?stayLogged=${stayLoggedIn}&mode=${mode}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sendingData),
        credentials: "include"
    });
}

export async function getAuthenticationOptions(mode: 'pass', email: string): Promise<string>;
export async function getAuthenticationOptions(mode: 'key'): Promise<PublicKeyCredentialRequestOptions>;
export async function getAuthenticationOptions(mode: 'pass' | 'key', email = ""): Promise<PublicKeyCredentialRequestOptions|string> {
    const response = await fetch(`${apiUrl}/auth/authentication-options?mode=${mode}&email=${email}`, {
        credentials: "include"
    });
    if (mode === 'key') {
        return parseLoginOptions(await response.json());
    } else {
        return (await response.json()).salt;
    }
}

type PasswordResponse = {
    hash: number[]
}

export async function authenticate(data: PublicKeyCredentialWithAssertion | PasswordResponse, stayLogged: boolean, key?: number[], iv?: number[]): Promise<Response> {
    let authResponse: AuthenticationResponse | PasswordResponse;
    let mode: 'key' | 'pass' = "hash" in data ? 'pass' : 'key';
    if ("hash" in data) {
        authResponse = data;
    } else {
        authResponse = {
            id: data.id,
            rawId: asBase64url(data.rawId),
            type: data.type,
            response: {
                clientDataJSON: asBase64url(data.response.clientDataJSON),
                authenticatorData: asBase64url(data.response.authenticatorData),
                signature: asBase64url(data.response.signature),
                userHandle: data.response.userHandle ? asBase64url(data.response.userHandle) : null
            }
        };
    }

    return fetch(`${apiUrl}/auth/authenticate?stayLogged=${stayLogged}&mode=${mode}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...authResponse,
            encryptedKey: key || null,
            iv: iv || null
        }),
        credentials: "include"
    });
}

export async function validateEmail(email: string): Promise<Response> {
    return fetch(`${apiUrl}/auth/email-verification?email=${email}`, {
        credentials: "include"
    });
}
