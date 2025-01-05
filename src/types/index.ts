export interface ExchangeRates {
  [key: string]: number;
}

export interface CurrencyData {
  base: string;
  rates: { [key: string]: number };
  base_code: string;
  conversion_rates: string;
  result: object;
}
