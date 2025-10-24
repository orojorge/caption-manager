'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  if (rows.length === 0) {
    return (
      <div className="text-sm text-gray-600">
        No datasets yet
      </div>
    );
  }

  return (
    <section className="bg-gray-50 w-full">
      <ul className="mt-6 divide-y rounded-xl border bg-white shadow-sm">
        {rows.map((r) => (
          <li key={r.id} className="p-4 hover:bg-gray-50 transition">
            <Link
              href={{ pathname: `/explorer/${r.id}`, query: { name: r.name } }}
              className="flex items-center justify-between p-2"
            >
              <div className="">
                <div className="truncate text-sm font-medium text-gray-900">{r.name}</div>
                <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                {r.fileCount} file{r.fileCount !== 1 ? 's' : ''}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
