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

function fixBase64url(input: string): string {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) {
    input += '=';
  }
  return input;
}