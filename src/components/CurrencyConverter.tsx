import React, { useEffect, useState } from "react";
import { fetchExchangeRates } from "../api/exchangeRates";
import { ExchangeRates } from "../types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import CurrencySelect from "./CurrencySelect";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CurrencyConverter: React.FC = () => {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("RUB");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchExchangeRates();

        if (!data.rates || !data.base) {
          throw new Error("Некорректный ответ API");
        }

        setRates(data.rates);
        setFromCurrency(data.base);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Ошибка.");
        console.error("Ошибка:", error);
      }
    };

    fetchRates();
  }, []);

  useEffect(() => {
    if (
      Object.keys(rates).length > 0 &&
      rates[fromCurrency] &&
      rates[toCurrency]
    ) {
      const rate = rates[toCurrency] / rates[fromCurrency];
      setResult(amount * rate);
    } else {
      setResult(null);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const dollarChartData = {
    labels: Object.keys(rates),
    datasets: [
      {
        label: "Курс к доллару (USD)",
        data: Object.values(rates).map((rate) => rate / rates["USD"]),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.5)",
      },
    ],
  };

  const euroChartData = {
    labels: Object.keys(rates),
    datasets: [
      {
        label: "Курс к евро (EUR)",
        data: Object.values(rates).map((rate) => rate / rates["EUR"]),
        borderColor: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Курс валют",
      },
    },
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h1>Currency Converter</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "100px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <CurrencySelect
          currencies={Object.keys(rates)}
          selectedCurrency={fromCurrency}
          onChange={setFromCurrency}
        />
        <span>to</span>
        <CurrencySelect
          currencies={Object.keys(rates)}
          selectedCurrency={toCurrency}
          onChange={setToCurrency}
        />
      </div>
      <h2 style={{ marginTop: "20px" }}>
        {result !== null ? (
          <>
            Курс: <span style={{ color: "grey" }}>{result.toFixed(2)}</span>{" "}
            {toCurrency}
          </>
        ) : (
          <span style={{ color: "red" }}>Невозможно конвертировать</span>
        )}
      </h2>
      <div style={{ marginTop: "40px" }}>
        <h2>Курс валют к доллару (USD)</h2>
        <Line data={dollarChartData} options={chartOptions} />
      </div>
      <div style={{ marginTop: "40px" }}>
        <h2>Курс валют к евро (EUR)</h2>
        <Line data={euroChartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CurrencyConverter;
