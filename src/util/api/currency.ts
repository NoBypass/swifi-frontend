const apiUrl = import.meta.env.PUBLIC_API_URL;

export type Currency = {
    name: string;
};

export async function getCurrencies(): Promise<Currency[]> {
    const response = await fetch(`${apiUrl}/static/currencies`, {
        credentials: "include",
    });
    let data = await response.json();
    return data.map((currency: {
        iso_code: string;
    }) => {
        return {
            name: currency.iso_code,
        };
    });
}