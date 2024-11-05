const apiUrl = import.meta.env.PUBLIC_API_URL;

export async function getSetupStep(sessionCookie?: string): Promise<number|undefined> {
    let headers = {};
    if (sessionCookie) {
        headers = {
            "Cookie": `session=${sessionCookie}`
        };
    }

    const response = await fetch(`${apiUrl}/user/setupStep`, {
        credentials: "include",
        headers
    });
    return (await response.json()).setupStep;
}