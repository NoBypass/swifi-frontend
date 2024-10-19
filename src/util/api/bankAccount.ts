const apiUrl = import.meta.env.PUBLIC_API_URL;

type BankAccount = {
    name: string;
} & {
    balance: number;
    currency: string;
} | {}

export async function createBankAccounts(accounts: BankAccount[]): Promise<Response> {
    return fetch(`${apiUrl}/bank-account/add`, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(accounts),
    });
}