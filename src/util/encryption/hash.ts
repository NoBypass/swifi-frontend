export async function hashWithSalt(salt: string, value: string): Promise<string> {
  const data = new TextEncoder().encode(salt + value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
