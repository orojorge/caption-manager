'use client';

import { useEffect, useState } from 'react';
import { listDatasets, listProfiles, createTask, runMockCaptioning, Profile, Dataset } from '@/lib/repo';

const MODELS = ['OpenAI GPT-V', 'Claude', 'Gemini', 'Moondream'];

export default function TasksPage() {
	const [datasets, setDatasets] = useState<Dataset[]>([]);
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [datasetId, setDatasetId] = useState('');
	const [profileId, setProfileId] = useState('');
	const [model, setModel] = useState(MODELS[0]);
	const [status, setStatus] = useState<'idle'|'launching'|'running'|'done'>('idle');

	useEffect(() => {
    (async () => {
      const [ds, ps] = await Promise.all([listDatasets(), listProfiles()]);
      setDatasets(ds); setProfiles(ps);
      if (ds[0]) setDatasetId(ds[0].id);
      if (ps[0]) setProfileId(ps[0].id);
    })();
  }, []);

	const launch = async () => {
    if (!datasetId || !profileId) return alert('Choose a dataset and a profile.');
    const profile = profiles.find(p => p.id === profileId)!;
    setStatus('launching');
    const task = await createTask({ datasetId, profileId, model });
    setStatus('running');
    await runMockCaptioning(task.id, datasetId, profile.name, profile.systemPrompt, model);
    setStatus('done');
		// alert('Task finished successfully.');
  };

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-semibold text-gray-800">Tasks</h1>
      {/* <TaskLauncher /> */}
      <section className="mt-12 w-full max-w-3xl">
				<h2 className="mb-3 text-lg font-semibold text-gray-800">Launch Captioning Task</h2>
				<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="grid gap-4 sm:grid-cols-3">
						<div className="sm:col-span-1">
							<label className="block text-sm font-medium text-gray-700">Dataset</label>
							<select
								value={datasetId}
								onChange={(e) => setDatasetId(e.target.value)}
								className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
							>
								{datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
							</select>
						</div>
						<div className="sm:col-span-1">
							<label className="block text-sm font-medium text-gray-700">Profile</label>
							<select
								value={profileId}
								onChange={(e) => setProfileId(e.target.value)}
								className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
							>
								{profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
							</select>
						</div>
						<div className="sm:col-span-1">
							<label className="block text-sm font-medium text-gray-700">Model</label>
							<select
								value={model}
								onChange={(e) => setModel(e.target.value)}
								className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
							>
								{MODELS.map(m => <option key={m} value={m}>{m}</option>)}
							</select>
						</div>
					</div>

					<div className="mt-6 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<button
								onClick={launch}
								className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
								disabled={!datasetId || !profileId || status === 'running'}
							>
								{status === 'running' ? 'Running…' : 'Start task'}
							</button>
						</div>

						<StatusPill state={status} />
					</div>
				</div>
    	</section>
    </main>
  );
}

function StatusPill({ state }: { state: 'idle'|'launching'|'running'|'done' }) {
  const label =
    state === 'idle' ? 'Idle' :
    state === 'launching' ? 'Queued' :
    state === 'running' ? 'Running' : 'Done';
  const cls =
    state === 'done' ? 'bg-green-100 text-green-700' :
    state === 'running' ? 'bg-amber-100 text-amber-700' :
    state === 'launching' ? 'bg-blue-100 text-blue-700' :
    'bg-gray-100 text-gray-700';
  return <span className={`rounded-full px-3 py-1 text-xs ${cls}`}>{label}</span>;
}