export interface QueuedSubmission {
  id: string;
  assetId: string;
  name: string;
  category: string;
  locationId: string;
  condition: string;
  remarks: string;
  latitude: number;
  longitude: number;
  photos: string[];
  timestamp: number;
  queuedAt: number;
}

const QUEUE_KEY = 'asset_verification_queue';

function loadQueue(): QueuedSubmission[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QueuedSubmission[];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedSubmission[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export const offlineQueue = {
  add(submission: Omit<QueuedSubmission, 'id' | 'queuedAt'>): QueuedSubmission {
    const queue = loadQueue();
    const entry: QueuedSubmission = {
      ...submission,
      id: `queue_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      queuedAt: Date.now(),
    };
    queue.push(entry);
    saveQueue(queue);
    return entry;
  },

  getAll(): QueuedSubmission[] {
    return loadQueue();
  },

  remove(id: string): void {
    const queue = loadQueue().filter(item => item.id !== id);
    saveQueue(queue);
  },

  count(): number {
    return loadQueue().length;
  },

  clear(): void {
    localStorage.removeItem(QUEUE_KEY);
  },
};
