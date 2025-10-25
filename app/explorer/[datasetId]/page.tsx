'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import * as React from "react";
import { getFilesByDataset, updateFileCaption, FileRow } from '@/lib/repo';
import Menu from '../../components/Menu';
import ProductCard from '../../components/ProductCard';

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
    <main className="flex min-h-screen bg-gray-100">
      <Menu />

      <section className="flex-1 h-screen overflow-auto px-8 py-12">
        <div className="w-full">
					<div className="mb-6 flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-semibold text-gray-900">{datasetName}</h1>
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
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{files.map((f) => (
									<ProductCard
										key={f.id}
										imgSrc={previews[f.id]}
										name={f.name}
										caption={f.caption}
										onCaptionChange={(v) => onCaptionChange(f.id, v)}
										onSave={() => saveCaption(f.id, f.caption)}
										saving={!!saving[f.id]}
										attachRef={(el) => { textareasRef.current[f.id] = el; }}
									/>
								))}
							</div>
						)
					}
				</div>
			</section>
		</main>
	);
}
