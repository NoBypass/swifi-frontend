export async function handleSwifi<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => {
      throw new Error("An unexpected error occurred. Please try again.")
    });
    throw new Error(error.message);
  }

  const contentLength = response.headers.get("Content-Length");
  if (contentLength === "0" || !contentLength) {
    return undefined as unknown as T;
  }

  return response.json();
}