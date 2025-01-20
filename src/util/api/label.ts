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

export type Label = {
  id: string;
  name: string;
  color: string;
};

export async function getAllLabels(session: string): Promise<Label[]> {
  const response = await fetch(`${apiUrl}/label/all`, {
    method: 'GET',
    headers: {
      Cookie: `session=${session}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch labels');
  }

  return await response.json();
}
