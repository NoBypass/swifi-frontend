type CapitalSourceBase = {
  id: string;
  name: string;
  currency: string;
};

export type CapitalSource = CapitalSourceBase & {
  initialBalance: number;
};

export type CapitalSourceResponse = CapitalSourceBase & {
  initialBalance: string;
};