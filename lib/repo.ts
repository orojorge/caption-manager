import { openDB } from './idb';
import { v4 as uuidv4 } from "uuid";

export interface Dataset {
  id: string;
  name: string;
  createdAt: number; // epoch ms
}

export async function createDataset(name: string): Promise<Dataset> {
  const db = await openDB();
  const dataset: Dataset = { id: uuidv4(), name, createdAt: Date.now() };
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(['datasets'], 'readwrite');
    tx.objectStore('datasets').put(dataset);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  return dataset;
}

export async function addFiles(datasetId: string, files: File[]): Promise<void> {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(['files'], 'readwrite');
    const store = tx.objectStore('files');
    files.forEach((f) =>
      store.put({
        id: uuidv4(),
        datasetId,
        name: f.name,
        type: f.type,
        size: f.size,
        blob: f, // File is a Blob
      })
    );
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

export async function listDatasets(): Promise<Dataset[]> {
  const db = await openDB();
  return await new Promise((res, rej) => {
    const tx = db.transaction(['datasets'], 'readonly');
    const req = tx.objectStore('datasets').getAll();
    req.onsuccess = () => {
      const list = (req.result as Dataset[]).sort((a, b) => b.createdAt - a.createdAt);
      res(list);
    };
    req.onerror = () => rej(req.error);
  });
}

export async function countFilesForDataset(datasetId: string): Promise<number> {
  const db = await openDB();
  return await new Promise((res, rej) => {
    const tx = db.transaction(['files'], 'readonly');
    const index = tx.objectStore('files').index('byDataset');
    let count = 0;
    const cursorReq = index.openCursor(IDBKeyRange.only(datasetId));
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (cursor) {
        count++;
        cursor.continue();
      } else res(count);
    };
    cursorReq.onerror = () => rej(cursorReq.error);
  });
}
