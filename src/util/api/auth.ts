import { asBase64url, fixBase64url } from '@util/encryption/util';
import { handleSwifi } from '@api/util.ts';

const apiUrl = import.meta.env.PUBLIC_API_URL;

export type PublicKeyCredentialWithTransports = PublicKeyCredential & {
  response: AuthenticatorAttestationResponse;
  transports?: string[];
};

export type PublicKeyCredentialWithAssertion = PublicKeyCredential & {
  response: AuthenticatorAssertionResponse;
};

export type AuthenticationResponse = {
  id: string;
  rawId: string;
  type: string;
  response: {
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle: string | null;
  };
} & {
  encryptedKey?: string;
};

export type RegistrationResponse = {
  id: string;
  rawId: string;
  type: string;
  response: {
    clientDataJSON: string;
    attestationObject: string;
  };
};

export function parseLoginAssertion(assertion: PublicKeyCredentialWithAssertion): AuthenticationResponse {
  return {
    id: assertion.id,
    rawId: asBase64url(assertion.rawId),
    type: assertion.type,
    response: {
      clientDataJSON: asBase64url(assertion.response.clientDataJSON),
      authenticatorData: asBase64url(assertion.response.authenticatorData),
      signature: asBase64url(assertion.response.signature),
      userHandle: assertion.response.userHandle
        ? asBase64url(assertion.response.userHandle)
        : null,
    },
  };
}

export function parseSignupCredential(
  credential: PublicKeyCredentialWithTransports
): RegistrationResponse {
  return {
    id: credential.id,
    rawId: asBase64url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: asBase64url(credential.response.clientDataJSON),
      attestationObject: asBase64url(credential.response.attestationObject),
    },
  };
}

export function parseSignupOptions(options: any): PublicKeyCredentialCreationOptions {
  options.challenge = Uint8Array.from(
    atob(fixBase64url(options.challenge)),
    (c) => c.charCodeAt(0)
  );
  options.user.id = Uint8Array.from(atob(fixBase64url(options.user.id)), (c) =>
    c.charCodeAt(0)
  );
  if (options.extensions?.prf?.eval?.first) {
    options.extensions.prf.eval.first = new TextEncoder().encode(
      options.extensions.prf.eval.first
    );
  }
  return options;
}

export function parseLoginOptions(options: any): any {
  options.challenge = Uint8Array.from(
    atob(fixBase64url(options.challenge)),
    (c) => c.charCodeAt(0)
  );
  if (options.extensions?.prf?.eval?.first) {
    options.extensions.prf.eval.first = new TextEncoder().encode(
      options.extensions.prf.eval.first
    );
  }
  return options;
}

export async function logout(): Promise<Response> {
  return fetch(`${apiUrl}/auth/logout`, {
    credentials: 'include',
  });
}

type AuthenticationMethod = {
  id: string;
  encryptedKey: string;
  type: 'password' | 'webauthn';
  salt?: string;
}

type PasswordRegistrationResponse = {
  salt: string;
  ams?: AuthenticationMethod[];
}

type WebauthnRegistrationResponse = {
  options: PublicKeyCredentialCreationOptions;
  ams?: AuthenticationMethod[];
}

export async function getRegistrationOptions(mode: 'password', name?: string): Promise<PasswordRegistrationResponse>;
export async function getRegistrationOptions(mode: 'webauthn', name?: string): Promise<WebauthnRegistrationResponse>;
export async function getRegistrationOptions(mode: 'password' | 'webauthn', name?: string): Promise<WebauthnRegistrationResponse | PasswordRegistrationResponse> {
  const params = new URLSearchParams();
  params.append('mode', mode);
  if (name) {
    params.append('name', name);
  }

  const data = await handleSwifi<any>(
    await fetch(`${apiUrl}/auth/registration-options?${params.toString()}`, {
      credentials: 'include',
    }
  ));

  if (mode === 'webauthn') {
    return {
      options: parseSignupOptions(data.options),
      ams: data.ams
    }
  } else {
    return data;
  }
}

type PasswordRegistration = {
  email: string;
  hash: string;
  encodedKey: string;
};

export async function register(data: PublicKeyCredentialWithTransports | PasswordRegistration, stayLoggedIn: boolean): Promise<void> {
  let mode: 'password' | 'webauthn';
  let sendingData: {
    stayLogged: boolean;
    webauthn?: RegistrationResponse;
    password?: PasswordRegistration
  } = { stayLogged: stayLoggedIn };

  if ('hash' in data) {
    mode = 'password';
    sendingData.password = data;
  } else {
    mode = 'webauthn';
    sendingData.webauthn = parseSignupCredential(data);
  }

  return handleSwifi(await fetch(
    `${apiUrl}/auth/register?mode=${mode}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendingData),
      credentials: 'include',
    }
  ));
}

export async function getAuthenticationOptions(mode: 'password', email: string): Promise<string>;
export async function getAuthenticationOptions(mode: 'webauthn'): Promise<PublicKeyCredentialRequestOptions>;
export async function getAuthenticationOptions(mode: 'password' | 'webauthn', email = ''): Promise<PublicKeyCredentialRequestOptions | string> {
  const data = await handleSwifi<any>(await fetch(
    `${apiUrl}/auth/authentication-options?mode=${mode}&email=${email}`,
    {
      credentials: 'include',
    }
  ));

  if (mode === 'webauthn') {
    return parseLoginOptions(data);
  } else {
    return data.salt;
  }
}

type PasswordAuthenticationResponse = {
  hash: string;
};

export type EncryptionKey = {
  type: string;
  encryptedKey: number[];
  iv: number[];
  hash: number[];
  salt: number[];
};

export type Passkey = {
  id: string;
  encryptionKey: EncryptionKey;
};

export type User = {
  id: string;
  name: string;
  setupStep: number;
};

export async function authenticate(
  data: PublicKeyCredentialWithAssertion | PasswordAuthenticationResponse,
  stayLogged: boolean,
  encryptedKey?: string
): Promise<User> {
  let authResponse: AuthenticationResponse | PasswordAuthenticationResponse;
  let mode: 'webauthn' | 'password' = 'hash' in data ? 'password' : 'webauthn';

  if (mode === 'webauthn') {
    authResponse = parseLoginAssertion(data as PublicKeyCredentialWithAssertion);
    authResponse.encryptedKey = encryptedKey;
  } else {
    authResponse = data as PasswordAuthenticationResponse;
  }

  return handleSwifi<User>(await fetch(
    `${apiUrl}/auth/authenticate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stayLogged,
        mode,
        password: authResponse
      }),
      credentials: 'include',
    }
  ));
}

export async function validateEmail(email: string): Promise<Response> {
  return fetch(`${apiUrl}/auth/email-verification?email=${email}`, {
    credentials: 'include',
  });
}
