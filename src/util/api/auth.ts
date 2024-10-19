import {asBase64url, fixBase64url} from "@util/encryption";

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

export type SignupResponse = {
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

export function parseSignupCredential(credential: PublicKeyCredentialWithTransports): SignupResponse {
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

export function parseSignupOptions(options: any): any {
    options.challenge = Uint8Array.from(atob(fixBase64url(options.challenge)), c => c.charCodeAt(0));
    options.user.id = Uint8Array.from(atob(fixBase64url(options.user.id)), c => c.charCodeAt(0));
    return options;
}

export function parseLoginOptions(options: any): any {
    options.challenge = Uint8Array.from(atob(fixBase64url(options.challenge)), c => c.charCodeAt(0));
    return options;
}

export async function logout(): Promise<Response> {
    return fetch(`${apiUrl}/auth/logout`, {
        credentials: "include",
    });
}
