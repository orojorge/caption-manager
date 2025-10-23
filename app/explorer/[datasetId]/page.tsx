'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import * as React from "react";
// import Link from 'next/link';
import { getFilesByDataset, updateFileCaption, FileRow } from '@/lib/repo';
import Menu from '../../components/Menu';

type Props = {
  params: Promise<{ datasetId: string }>;
};

export default function ExplorerPage({ params }: Props) {
	const { datasetId } = React.use<{ datasetId: string }>(params);
	const search = useSearchParams();
  const datasetName = search.get('name') || 'Explorer';
	const [files, setFiles] = useState<FileRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState<Record<string, boolean>>({});

	useEffect(() => {
		let mounted = true;
		(async () => {
			setLoading(true);
			const rows = await getFilesByDataset(datasetId);
			if (!mounted) return;
			setFiles(rows);
			setLoading(false);
		})();
		return () => { mounted = false; };
	}, [datasetId]);

	// Create object URLs for previews and clean them up
	const previews = useMemo(() => {
		const map: Record<string, string> = {};
		files.forEach((f) => (map[f.id] = URL.createObjectURL(f.blob)));
		return map;
	}, [files]);

	useEffect(() => {
		return () => Object.values(previews).forEach((u) => URL.revokeObjectURL(u));
	}, [previews]);

	const onCaptionChange = (id: string, v: string) =>
		setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, caption: v } : f)));

	const saveCaption = async (id: string, caption: string | undefined) => {
		setSaving((s) => ({ ...s, [id]: true }));
		try {
			await updateFileCaption(id, caption ?? '');
		} finally {
			setSaving((s) => ({ ...s, [id]: false }));
		}
	};

	return (
		<main className="flex min-h-screen bg-gray-50">
			<Menu />
			
			<section className="min-h-screen bg-gray-50 px-4 py-8 w-full">
				<div className="pl-8 max-w-6xl">
					<div className="mb-6 flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-semibold text-gray-900">{datasetName}</h1>
							{/* <p className="text-sm text-gray-600">Dataset: {datasetId}</p> */}
							<p className="text-sm text-gray-600">Dataset</p>
						</div>
					</div>

					{loading ? (
							<div className="text-gray-600">Loading images…</div>
						) : files.length === 0 ? (
							<div className="rounded-lg border bg-white p-6 text-gray-600">
								No images found for this dataset.
							</div>
						) : (
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{files.map((f) => (
									<div key={f.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
										<img
										src={previews[f.id]}
										alt={f.name}
										className="h-56 w-full object-cover"
										/>
										<div className="space-y-3 p-4">
											<div className="text-sm font-medium text-gray-900 truncate">{f.name}</div>
											<textarea
													value={f.caption ?? ''}
													onChange={(e) => onCaptionChange(f.id, e.target.value)}
													placeholder="Write a caption…"
													className="h-24 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
											/>
											<div className="flex justify-end">
												<button
												onClick={() => saveCaption(f.id, f.caption)}
												disabled={!!saving[f.id]}
												className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700 disabled:opacity-60"
												>
													{saving[f.id] ? 'Saving…' : 'Save caption'}
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)
					}
				</div>
			</section>
		</main>
	);
}
