export type PublicKeyCredentialWithTransports = PublicKeyCredential & {
    response: AuthenticatorAttestationResponse;
    transports?: string[];
};

export type PublicKeyCredentialWithAssertion = PublicKeyCredential & {
    response: AuthenticatorAssertionResponse;
};
