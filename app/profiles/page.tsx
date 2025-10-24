'use client';

import { useEffect, useState } from 'react';
// import Link from 'next/link';
import { Profile, listProfiles, createProfile, updateProfile, deleteProfile } from '@/lib/repo';
import Menu from '../components/Menu';
import ProfilesList from '../components/ProfilesList';
import Profiles from '../components/ProfilesList';

export default function ProfilesPage() {
  const [items, setItems] = useState<Profile[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState({ name: '', systemPrompt: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ name: string; systemPrompt: string }>({ name: '', systemPrompt: '' });
  const [busy, setBusy] = useState(false);

  const load = async () => setItems(await listProfiles());
  useEffect(() => { load(); }, []);

  const startEdit = (p: Profile) => { setEditingId(p.id); setDraft({ name: p.name, systemPrompt: p.systemPrompt }); };
  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = async (id: string) => {
    setBusy(true);
    try {
      await updateProfile(id, { name: draft.name.trim(), systemPrompt: draft.systemPrompt.trim() });
      await load();
      setEditingId(null);
    } finally { setBusy(false); }
  };

  const onCreate = async () => {
    const name = creating.name.trim();
    const systemPrompt = creating.systemPrompt.trim();
    if (!name || !systemPrompt) return alert('Provide name and system prompt.');
    setBusy(true);
    try {
      await createProfile({ name, systemPrompt });
      setCreating({ name: '', systemPrompt: '' });
      setShowCreate(false);
      await load();
    } finally { setBusy(false); }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this profile?')) return;
    setBusy(true);
    try { await deleteProfile(id); await load(); } finally { setBusy(false); }
  };

  return (
    <main className="flex min-h-screen bg-gray-50">
      <Menu />

      <section className="flex-1 h-screen overflow-auto bg-gray-50 px-8 py-8">
        <div className="max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Profiles</h1>
              <p className="text-sm text-gray-600">Create, edit, and delete captioning profiles</p>
            </div>
          </div>

          <div className="mb-4">
            <button
              onClick={() => setShowCreate((v) => !v)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showCreate ? 'Cancel' : 'Create New'}
            </button>
          </div>

          {showCreate && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile name</label>
                  <input
                    value={creating.name}
                    onChange={(e) => setCreating((s) => ({ ...s, name: e.target.value }))}
                    placeholder="e.g. Short, friendly captions"
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">System prompt</label>
                  <textarea
                    value={creating.systemPrompt}
                    onChange={(e) => setCreating((s) => ({ ...s, systemPrompt: e.target.value }))}
                    placeholder="Tone, length, structure…"
                    className="mt-1 h-24 w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-md border border-gray-300 text-sm px-4 py-2 text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>
                <button
                  disabled={busy}
                  onClick={onCreate}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  Create profile
                </button>
              </div>
            </div>
          )}

          {/* List */}
          {items.length === 0 ? (
            <div className="text-sm text-gray-600">No profiles yet</div>
          ) : (
            <ul className="mt-6 divide-y rounded-xl border bg-white shadow-sm">
              {items.map((p) => (
                <li key={p.id} className="p-4">
                  {editingId === p.id ? (
                    <div className="space-y-3">
                      <input
                        value={draft.name}
                        onChange={(e) => setDraft((s) => ({ ...s, name: e.target.value }))}
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={draft.systemPrompt}
                        onChange={(e) => setDraft((s) => ({ ...s, systemPrompt: e.target.value }))}
                        className="h-24 w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          disabled={busy}
                          onClick={() => saveEdit(p.id)}
                          className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-gray-900">{p.name}</div>
                        <div className="mt-1 text-xs text-gray-600">{p.systemPrompt}</div>
                        <div className="mt-1 text-[11px] text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="rounded-md border px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
                          className="rounded-md border px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
