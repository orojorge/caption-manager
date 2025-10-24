'use client';

import { useEffect, useState } from 'react';
import { listDatasets, listProfiles, createTask, runMockCaptioning, Profile, Dataset } from '@/lib/repo';
import Menu from '../components/Menu';
import TaskLauncher from '../components/TaskLauncher';

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
    <main className="flex min-h-screen bg-gray-50">
      <Menu />

      <section className="flex-1 h-screen overflow-auto bg-gray-50 px-4 py-8">
				<div className="pl-8 max-w-4xl">
						<div className="mb-6 flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-semibold text-gray-900">Tasks Launcher</h1>
								<p className="text-sm text-gray-600">Caption datasets with AI</p>
							</div>
						</div>

					<TaskLauncher />
				</div>
			</section>
		</main>
  );
}
