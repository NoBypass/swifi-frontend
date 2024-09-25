export type SignupOptionsResponse = {
    challenge: string;
    rp: {
        name: string;
    };
    user: {
        id: string;
        name: string;
        displayName: string;
    };
    pubKeyCredParams: Array<{ type: string; alg: number }>;
    authenticatorSelection: {
        userVerification: string;
    };
    timeout: number;
    attestation: string;
};

export type PublicKeyCredentialWithTransports = PublicKeyCredential & {
    response: AuthenticatorAttestationResponse;
    transports?: string[];
};
