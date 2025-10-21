const DB_NAME = 'captionManager';
const DB_VERSION = 3;

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('datasets')) {
        const ds = db.createObjectStore('datasets', { keyPath: 'id' });
        ds.createIndex('createdAt', 'createdAt');
      }
      if (!db.objectStoreNames.contains('files')) {
        const fs = db.createObjectStore('files', { keyPath: 'id' });
        fs.createIndex('byDataset', 'datasetId');
      }
      if (!db.objectStoreNames.contains('profiles')) {
        const ps = db.createObjectStore('profiles', { keyPath: 'id' });
        ps.createIndex('createdAt', 'createdAt');
      }
      if (!db.objectStoreNames.contains('tasks')) {
        const ts = db.createObjectStore('tasks', { keyPath: 'id' });
        ts.createIndex('createdAt', 'createdAt');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
