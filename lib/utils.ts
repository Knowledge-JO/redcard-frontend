import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function distributePrizeUnevenly(
  tickets: number,
  totalPrize: number
): number[] {
  if (tickets <= 0 || totalPrize <= 0) {
    throw new Error("Both tickets and totalPrize must be greater than zero.");
  }

  const randomValues: number[] = [];
  for (let i = 0; i < tickets; i++) {
    randomValues.push(Math.random());
  }

  const totalRandom = randomValues.reduce((sum, value) => sum + value, 0);

  const prizeDistribution: number[] = randomValues.map(
    (value) => (value / totalRandom) * totalPrize
  );

  const currentTotal = prizeDistribution.reduce((sum, value) => sum + value, 0);
  const difference = totalPrize - currentTotal;

  if (difference !== 0) {
    prizeDistribution[0] += difference;
  }

  return prizeDistribution;
}

export function createTelegramShareLink(url: string, text: string) {
  const baseURL = "https://t.me/share/url";
  const params = new URLSearchParams({
    url: url,
    text: text,
  });
  return `${baseURL}?${params.toString()}`;
}

export function fileToBlob(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(new Blob([reader.result || ""], { type: file.type }));
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}
