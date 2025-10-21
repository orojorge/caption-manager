import { openDB } from './idb';
import { v4 as uuidv4 } from "uuid";

export interface Dataset {
	id: string;
	name: string;
	createdAt: number;
}

export interface FileRow {
	id: string;
	datasetId: string;
	name: string;
	type: string;
	size: number;
	blob: Blob;
	caption?: string;
}

export interface Profile {
  id: string;
  name: string;
  systemPrompt: string;
  createdAt: number;
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

export async function getFilesByDataset(datasetId: string): Promise<FileRow[]> {
	const db = await openDB();
	return await new Promise((res, rej) => {
		const tx = db.transaction(['files'], 'readonly');
		const index = tx.objectStore('files').index('byDataset');
		const out: FileRow[] = [];
		const cursorReq = index.openCursor(IDBKeyRange.only(datasetId));
		cursorReq.onsuccess = () => {
				const c = cursorReq.result;
				if (c) { out.push(c.value as FileRow); c.continue(); }
				else res(out);
		};
		cursorReq.onerror = () => rej(cursorReq.error);
  });
}

export async function updateFileCaption(fileId: string, caption: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
		const tx = db.transaction(['files'], 'readwrite');
		const store = tx.objectStore('files');
		const getReq = store.get(fileId);
		getReq.onsuccess = () => {
			const rec = getReq.result as FileRow | undefined;
			if (!rec) { rej(new Error('File not found')); return; }
			store.put({ ...rec, caption });
		};
		tx.oncomplete = () => res();
		tx.onerror = () => rej(tx.error);
  });
}

// Profile
export async function createProfile(input: Omit<Profile, 'id' | 'createdAt'>): Promise<Profile> {
  const db = await openDB();
  const profile: Profile = { id: uuidv4(), createdAt: Date.now(), ...input };
  await new Promise<void>((res, rej) => {
		const tx = db.transaction(['profiles'], 'readwrite');
		tx.objectStore('profiles').put(profile);
		tx.oncomplete = () => res();
		tx.onerror = () => rej(tx.error);
  });
  return profile;
}

export async function listProfiles(): Promise<Profile[]> {
  const db = await openDB();
  return await new Promise((res, rej) => {
    const tx = db.transaction(['profiles'], 'readonly');
    const req = tx.objectStore('profiles').getAll();
    req.onsuccess = () => {
      const list = (req.result as Profile[]).sort((a, b) => b.createdAt - a.createdAt);
      res(list);
    };
    req.onerror = () => rej(req.error);
  });
}

export async function deleteProfile(id: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(['profiles'], 'readwrite');
    tx.objectStore('profiles').delete(id);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

export async function updateProfile(id: string, patch: Partial<Omit<Profile, 'id' | 'createdAt'>>): Promise<Profile> {
  const db = await openDB();
  return await new Promise((res, rej) => {
    const tx = db.transaction(['profiles'], 'readwrite');
    const store = tx.objectStore('profiles');
    const get = store.get(id);
    get.onsuccess = () => {
      const current = get.result as Profile | undefined;
      if (!current) { rej(new Error('Profile not found')); return; }
      const updated: Profile = { ...current, ...patch };
      store.put(updated);
      tx.oncomplete = () => res(updated);
    };
    tx.onerror = () => rej(tx.error);
  });
}