'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { Dataset, listDatasets, countFilesForDataset, listProfiles, Profile } from '@/lib/repo';

type Row = Dataset & { fileCount: number };

export default function Menu() {
  const [rows, setRows] = useState<Row[]>([]);
  const [items, setItems] = useState<Profile[]>([]);

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

  const loadItems = async () => setItems(await listProfiles());
  useEffect(() => { loadItems(); }, []);

  return (
    <aside className="sticky top-0 h-screen w-65 shrink-0 overflow-y-auto bg-white p-4">
      <div className="mb-12">
        <Image
          src="/SARTIQ_TAGLINE_100_op-dark.svg"
          alt="Sartiq.ai"
          width={0}
          height={0}
          className="h-6 w-auto"
          priority
        />
      <div className="mt-1">Caption Manager</div>
      </div>

      <div className="space-y-10">
        <div className="">
          <h2 className="mb-2 text-lg font-semibold">
            <Link href="/">Datasets</Link>
          </h2>
          <div className="w-full max-w-xl">
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
          </div>
        </div>

        <div className="">
          <h2 className="mb-2 text-lg font-semibold">
            <Link href="/profiles">Profiles</Link>
          </h2>
          <section className="w-full max-w-xl">
            {items.length === 0 ? (
                <div className="p-2 text-sm font-medium text-gray-600">
                  No profiles yet. Create your first on Profiles.
                </div>
              ) : (
              <ul>
                {items.map((p) => (
                  <li key={p.id}>
                    <Link
                      href="/profiles"
                      className="flex items-center justify-between p-2 hover:bg-gray-50 transition"
                    >
                      <div className="truncate text-sm font-medium text-gray-900">{p.name}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
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
