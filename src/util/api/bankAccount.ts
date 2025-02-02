const apiUrl = import.meta.env.PUBLIC_API_URL;

type CreateBankAccount =
  | ({
      name: string;
    } & {
      balance: number;
      currency: string;
    })
  | {};

export async function createBankAccounts(
  accounts: CreateBankAccount[]
): Promise<Response> {
  return fetch(`${apiUrl}/bank-account/add`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(accounts),
  });
}

export type BankAccount = {
  id: string;
  name: string;
  balance: string;
  currency: {
    iso_code: string;
  };
};

export async function getBankAccounts(session: string): Promise<BankAccount[]> {
  const response = await fetch(`${apiUrl}/bank-account/all`, {
    credentials: 'include',
    headers: {
      Cookie: `session=${session}`,
    },
  });

  return response.json();
}
