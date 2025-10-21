'use client';

import { useEffect, useState } from 'react';
import { Dataset, listDatasets, countFilesForDataset } from '@/lib/repo';

type Row = Dataset & { fileCount: number };

export default function DatasetList() {
  const [rows, setRows] = useState<Row[]>([]);

  const load = async () => {
    const ds = await listDatasets();
    const withCounts = await Promise.all(
      ds.map(async (d) => ({ ...d, fileCount: await countFilesForDataset(d.id) }))
    );
    setRows(withCounts);
  };

  useEffect(() => {
    load();
    // Optional: refresh after uploads via window event bus
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  if (rows.length === 0) {
    return (
      <div className="mt-8 text-sm text-gray-600">
        No datasets yet. Upload some images to get started.
      </div>
    );
  }

  return (
    <div className="mt-10 w-full max-w-xl">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">Datasets</h2>
      <ul className="divide-y rounded-xl border bg-white shadow-sm">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium text-gray-900">{r.name}</div>
              <div className="text-xs text-gray-500">
                {new Date(r.createdAt).toLocaleString()}
              </div>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
              {r.fileCount} file{r.fileCount !== 1 ? 's' : ''}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
