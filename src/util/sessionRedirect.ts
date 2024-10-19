export async function sessionRedirect(url: string): Promise<string|null> {
    const response = await fetch(`${url}/user/setupStep`, {
        credentials: "include",
    });
    if (!response.ok) return null
    const step = (await response.json()).setupStep;
    if (step === -1) return "/dashboard/overview";
    else {
        const route = `/setup/step${step}`
        if (window.location.pathname !== route) return route;
        else return null;
    }
}