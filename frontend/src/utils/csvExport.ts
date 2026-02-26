import type { Asset } from '../backend';
import { formatTimestamp } from './formatTimestamp';

/**
 * Escapes a field value for CSV format per RFC 4180.
 * Wraps in quotes if the value contains commas, quotes, or newlines.
 */
export function escapeCSVField(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Converts a single Asset record to a CSV row array.
 */
export function assetToCSVRow(asset: Asset): string[] {
  return [
    asset.assetId,
    asset.name,
    asset.category,
    asset.locationId,
    asset.condition,
    asset.remarks,
    asset.gpsCoordinates.latitude.toString(),
    asset.gpsCoordinates.longitude.toString(),
    asset.photos.join(';'),
    formatTimestamp(asset.timestamp),
  ];
}

const CSV_HEADERS = [
  'Asset ID',
  'Asset Name',
  'Category',
  'Location',
  'Condition',
  'Remarks',
  'GPS Latitude',
  'GPS Longitude',
  'Photo Reference',
  'Timestamp',
];

/**
 * Generates a CSV string from an array of Asset records.
 */
export function generateCSV(assets: Asset[]): string {
  const headerRow = CSV_HEADERS.map(escapeCSVField).join(',');
  const dataRows = assets.map(asset =>
    assetToCSVRow(asset).map(escapeCSVField).join(',')
  );
  return [headerRow, ...dataRows].join('\r\n');
}

/**
 * Triggers a browser download of the CSV file.
 */
export function downloadCSV(assets: Asset[]): void {
  const csv = generateCSV(assets);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `asset-records-${today}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
