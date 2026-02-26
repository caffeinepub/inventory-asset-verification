export interface LocationOption {
  id: string;
  name: string;
  address: string;
}

export const LOCATIONS: LocationOption[] = [
  { id: 'WH-A', name: 'Warehouse A', address: 'North Industrial Zone, Block 1' },
  { id: 'WH-B', name: 'Warehouse B', address: 'North Industrial Zone, Block 2' },
  { id: 'BLDG-B', name: 'Building B - Main Office', address: 'Corporate Campus, Floor 1-5' },
  { id: 'BLDG-C', name: 'Building C - Operations', address: 'Corporate Campus, Floor 1-3' },
  { id: 'YARD-C', name: 'Storage Yard C', address: 'South Logistics Hub' },
  { id: 'FIELD-D', name: 'Field Site D', address: 'Eastern Sector, Km 12' },
  { id: 'FIELD-E', name: 'Field Site E', address: 'Western Sector, Km 8' },
  { id: 'MAINT', name: 'Maintenance Workshop', address: 'Technical Services Area' },
  { id: 'SERVER', name: 'Server Room / IT Hub', address: 'Building B, Basement' },
  { id: 'FLEET', name: 'Fleet Depot', address: 'Vehicle Management Area' },
];

export function getLocationName(locationId: string): string {
  return LOCATIONS.find(l => l.id === locationId)?.name ?? locationId;
}
