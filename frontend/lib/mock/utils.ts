export function hashString(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}

export function deterministicNumber(
  seed: string,
  min: number,
  max: number,
  decimals = 0
): number {
  const hash = hashString(seed);
  const normalized = hash / 0xffffffff;
  const raw = min + (max - min) * normalized;

  return Number(raw.toFixed(decimals));
}

export function deterministicInteger(
  seed: string,
  min: number,
  max: number
): number {
  return Math.round(deterministicNumber(seed, min, max, 0));
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
