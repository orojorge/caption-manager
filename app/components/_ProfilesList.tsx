// WIP
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listProfiles, Profile } from '@/lib/repo';


export default function Profiles() {
  const [items, setItems] = useState<Profile[]>([]);

  const load = async () => setItems(await listProfiles());
  useEffect(() => { load(); }, []);

  if (items.length === 0) {
    return (
      <div className="text-sm text-gray-600">
        No profiles yet. Create your first on Profiles.
      </div>
    );
  }

  return (
    <section className="w-full max-w-xl">
      <ul className="divide-y rounded-xl border bg-white shadow-sm">
        {items.map((p) => (
          <li key={p.id}>
            <Link
              href="/profiles"
              className="flex items-start justify-between gap-0 p-2 hover:bg-gray-50 transition"
            >
              <div>
                <div className="truncate text-sm font-medium text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-500 line-clamp-2">{p.systemPrompt}</div>
                <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
