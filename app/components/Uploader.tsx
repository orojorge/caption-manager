'use client';

import { useState } from 'react';
import { addFiles, createDataset } from '@/lib/repo';

type UploaderProps = {
  onComplete: () => void;
};

export default function Uploader({ onComplete }: UploaderProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [name, setName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return alert('Please select at least one image.');
    const datasetName = name?.trim() || `Dataset ${new Date().toLocaleString()}`;
    try {
      const ds = await createDataset(datasetName);
      await addFiles(ds.id, Array.from(files));
      setFiles(null);
      setName('');
      alert(`Saved "${ds.name}" with ${files.length} file(s).`);
			onComplete();
    } catch (e) {
      console.error(e);
      alert('Failed to save. Please try again.');
    }
  };

	if (!visible) return null;

  return (
    <div className="mt-8 w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <label className="block text-sm font-medium text-gray-700">Dataset name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. 2026 Spring/Summer Collection"
        className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
        {files && files.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Selected {files.length} file{files.length > 1 ? 's' : ''}.
          </p>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setVisible(false)}
          className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Create dataset
        </button>
      </div>
    </div>
  );
}
