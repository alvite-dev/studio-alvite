import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
}

export function formatArea(area: number): string {
  return `${area}m²`;
}

export function calculatePricePerSqm(price: number, area: number): number {
  return area > 0 ? price / area : 0;
}

export function formatPricePerSqm(price: number, area: number): string {
  const pricePerSqm = calculatePricePerSqm(price, area);
  return formatCurrency(pricePerSqm) + '/m²';
}