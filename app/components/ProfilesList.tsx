'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listProfiles, Profile } from '@/lib/repo';


export default function Profiles() {
  const [items, setItems] = useState<Profile[]>([]);

  const load = async () => setItems(await listProfiles());
  useEffect(() => { load(); }, []);

  return (
    <section className="mt-12 w-full max-w-3xl">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Profiles</h2>
        <Link href="/profiles" className="text-sm text-blue-600 hover:underline">All profiles →</Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 text-sm text-gray-600">No profiles yet. Create your first one above.</div>
      ) : (
        <ul className="mt-6 divide-y rounded-xl border bg-white shadow-sm">
          {items.map((p) => (
            <li key={p.id}>
              <Link href="/profiles" className="flex items-start justify-between gap-4 p-4 hover:bg-gray-50 transition">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900">{p.name}</div>
                  <div className="mt-1 text-xs text-gray-600 line-clamp-2">{p.systemPrompt}</div>
                  <div className="mt-1 text-[11px] text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
