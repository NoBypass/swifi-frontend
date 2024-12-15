const apiUrl = import.meta.env.PUBLIC_API_URL;

export async function createLabel(
  name: string,
  color: string
): Promise<Response> {
  return await fetch(`${apiUrl}/label/create`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, color }),
  });
}

export async function getAllLabels(): Promise<Response> {
  return await fetch(`${apiUrl}/label/all`, {
    credentials: 'include',
    method: 'GET',
  });
}
