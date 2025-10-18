export function localeDigitSeparator(
  number: number | null | undefined,
  locale: string | string[] = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string | number | null | undefined {
  if (number == null || isNaN(number as number)) {
    return number;
  }
  
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
    ...options
  };
  
  return new Intl.NumberFormat(locale, defaultOptions).format(number as number);
}