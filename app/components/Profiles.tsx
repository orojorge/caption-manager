'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createProfile, deleteProfile, listProfiles, Profile } from '@/lib/repo';

export default function Profiles() {
  const [items, setItems] = useState<Profile[]>([]);
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  const load = async () => setItems(await listProfiles());
  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    const n = name.trim(); const p = systemPrompt.trim();
    if (!n || !p) return alert('Please provide a name and a system prompt.');
    await createProfile({ name: n, systemPrompt: p });
    setName(''); setSystemPrompt(''); await load();
  };

  const onDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); e?.preventDefault();
    if (!confirm('Delete this profile?')) return;
    await deleteProfile(id); await load();
  };

  return (
    <section className="mt-12 w-full max-w-3xl">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Captioning Profiles</h2>
        <Link href="/profiles" className="text-sm text-blue-600 hover:underline">All profiles →</Link>
      </div>

      {/* Create */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Short, friendly captions"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">System prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Tone, length, structure…"
              className="mt-1 h-24 w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onCreate} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            Save profile
          </button>
        </div>
      </div>

      {/* List linking to /profiles */}
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
                <button
                  onClick={(e) => onDelete(p.id, e)}
                  className="rounded-md border px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                >
                  Delete
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
