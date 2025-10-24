'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
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
	const [focused, setFocused] = useState(false);

	const textareasRef = useRef<Record<string, HTMLTextAreaElement | null>>({});

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
			textareasRef.current[id]?.blur();
		} finally {
			setSaving((s) => ({ ...s, [id]: false }));
		}
	};

	return (
    <main className="flex min-h-screen bg-gray-200">
      <Menu />

      <section className="flex-1 h-screen overflow-auto bg-gray-50 px-8 py-8">
        <div className="w-full">
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
							<div className="rounded-sm border bg-white p-6 text-gray-600">
								No images found for this dataset.
							</div>
						) : (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{files.map((f) => (
									<div key={f.id} className="overflow-hidden shadow-sm border bg-white rounded-sm h-103">
										<div className="">
											<img
											src={previews[f.id]}
											alt={f.name}
											className="h-56 w-full object-contain"
											/>
										</div>
										<div className="group space-y-2 p-4">
											<div className="text-xs text-gray-500 truncate">{f.name}</div>
											<textarea
												ref={(el) => { textareasRef.current[f.id] = el; }}
												value={f.caption ?? ''}
												onChange={(e) => onCaptionChange(f.id, e.target.value)}
												placeholder="Write a caption…"
												className="h-24 w-full resize-none rounded-sm text-sm outline-none focus:ring-1 focus:ring-gray-300"
											/>
											<div className="hidden group-focus-within:flex justify-end">
												<button
													onMouseDown={(e) => e.preventDefault()}
													onClick={() => saveCaption(f.id, f.caption)}
													disabled={!!saving[f.id]}
													className="rounded-sm bg-blue-600 px-3 py-1.5 text-xs text-white transition hover:bg-blue-700 disabled:opacity-60"
												>
													{saving[f.id] ? 'Saving…' : 'Save'}
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
