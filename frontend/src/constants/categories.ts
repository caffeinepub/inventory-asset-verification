export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'furniture', name: 'Furniture', icon: '🪑' },
  { id: 'equipment', name: 'Equipment', icon: '⚙️' },
  { id: 'vehicles', name: 'Vehicles', icon: '🚛' },
  { id: 'tools', name: 'Tools', icon: '🔧' },
  { id: 'machinery', name: 'Machinery', icon: '🏭' },
  { id: 'safety', name: 'Safety Equipment', icon: '🦺' },
  { id: 'it-hardware', name: 'IT Hardware', icon: '🖥️' },
  { id: 'networking', name: 'Networking', icon: '📡' },
  { id: 'office-supplies', name: 'Office Supplies', icon: '📎' },
  { id: 'other', name: 'Other', icon: '📦' },
];

export function getCategoryName(categoryId: string): string {
  return CATEGORIES.find(c => c.id === categoryId)?.name ?? categoryId;
}
