'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
// import DatasetList from './DatasetList';
// import ProfilesList from './ProfilesList';
import { Dataset, listDatasets, countFilesForDataset } from '@/lib/repo';

type Row = Dataset & { fileCount: number };

export default function Menu() {
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
    // Refresh after uploads via window event bus
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <aside className="w-full max-w-xs h-screen overflow-y-auto bg-white p-4">
      <div className="mb-10 text-xl font-semibold">Sartiq.ai</div>

      <div className="space-y-10">
        <div className="">
          <h2 className="mb-2 text-lg font-semibold">
            <Link href="/">Datasets</Link>
          </h2>
          {/* <DatasetList /> */}
          <section className="w-full max-w-xl">
            {rows.length === 0 ? (
              <div className="p-2 text-sm font-medium text-gray-600">
                No datasets yet. Upload some images to get started.
              </div>
            ) : (
              <ul>
                {rows.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={{ pathname: `/explorer/${r.id}`, query: { name: r.name } }}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 transition"
                    >
                      <div className="truncate text-sm font-medium text-gray-900">{r.name}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="">
          <h2 className="mb-2 text-lg font-semibold">
            <Link href="/profiles">Profiles</Link>
          </h2>
          {/* <ProfilesList /> */}
        </div>

        <div className="">
          <h2 className="mb-2 text-lg font-semibold">
            <Link href="/tasks">Tasks</Link>
          </h2>
        </div>
      </div>
    </aside>
  );
}
