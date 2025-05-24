import { useMemo } from "react";

interface CurrencyFormatterProps {
  value: number;
  currency?: string;
  locale?: string;
}

export function CurrencyFormatter({ value, currency = "USD", locale = "ru-RU" }: CurrencyFormatterProps) {
  const formattedValue = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, [value, currency, locale]);

  return <>{formattedValue}</>;
}
