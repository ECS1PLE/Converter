import React from "react";

interface CurrencySelectProps {
  currencies: string[];
  selectedCurrency: string;
  onChange: (currency: string) => void;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  currencies,
  selectedCurrency,
  onChange,
}) => {
  return (
    <select
      value={selectedCurrency}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
      }}
    >
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelect;
