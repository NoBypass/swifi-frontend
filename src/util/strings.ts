export function title(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function takeErrPrefix(err: string): string {
  return err.split(':')[0];
}