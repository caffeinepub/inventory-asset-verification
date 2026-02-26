/**
 * Formats a bigint nanosecond timestamp from the backend into a human-readable string.
 */
export function formatTimestamp(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats a bigint nanosecond timestamp into a short date string.
 */
export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a bigint nanosecond timestamp into a time string.
 */
export function formatTime(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Converts a Date object to nanoseconds as a bigint.
 */
export function dateToNanoseconds(date: Date): bigint {
  return BigInt(date.getTime()) * BigInt(1_000_000);
}

/**
 * Returns current timestamp in nanoseconds as bigint.
 */
export function nowNanoseconds(): bigint {
  return dateToNanoseconds(new Date());
}
