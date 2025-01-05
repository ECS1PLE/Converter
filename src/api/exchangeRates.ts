import axios from "axios";
import { CurrencyData } from "../types";

const API_KEY = "652d3388b5de16b8f5762a1b";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

export const fetchExchangeRates = async (): Promise<CurrencyData> => {
  try {
    const response = await axios.get<CurrencyData>(API_URL);
    if (response.data.result !== "success") {
      throw new Error("Failed to fetch exchange rates");
    }
    return {
      base: response.data.base_code,
      rates: response.data.conversion_rates,
    };
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    throw error;
  }
};
