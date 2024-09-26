export function title(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function takeErrPrefix(err: string): string {
  return err.split(':')[0];
}

function base64urlToBase64(base64url: string) {
  return base64url.replace(/-/g, '+').replace(/_/g, '/');
}

function addBase64Padding(base64: string) {
  const pad = base64.length % 4;
  if (pad === 2) {
    return base64 + '==';
  } else if (pad === 3) {
    return base64 + '=';
  }
  return base64;
}

export function fixBase64url(base64url: string) {
  return addBase64Padding(base64urlToBase64(base64url));
}

export function base64ToBase64url(base64: string) {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
