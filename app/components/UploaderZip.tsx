'use client';

import { useState } from 'react';
import { addFiles, createDataset } from '@/lib/repo';
import { unzip } from 'fflate';

type UploaderProps = {
  visible: boolean;
  setVisible: (v: boolean) => void;
};

const IMG_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff', '.avif']);

function ext(name: string) {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i).toLowerCase() : '';
}

function guessMime(name: string) {
  const e = ext(name);
  if (e === '.png') return 'image/png';
  if (e === '.jpg' || e === '.jpeg') return 'image/jpeg';
  if (e === '.webp') return 'image/webp';
  if (e === '.gif') return 'image/gif';
  if (e === '.bmp') return 'image/bmp';
  if (e === '.tiff') return 'image/tiff';
  if (e === '.avif') return 'image/avif';
  return 'application/octet-stream';
}

async function extractZipImages(zipFile: File): Promise<File[]> {
  const buf = new Uint8Array(await zipFile.arrayBuffer());

  const files = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
    unzip(buf, (err, data) => (err ? reject(err) : resolve(data)));
  });

  const out: File[] = [];
  for (const [path, data] of Object.entries(files)) {
    const e = ext(path);
    if (!IMG_EXTS.has(e)) continue;
    const name = path.split('/').pop() || path;
    const blob = new Blob([new Uint8Array(data)], { type: guessMime(name) });
    out.push(new File([blob], name, { type: blob.type }));
  }
  return out;
}

export default function Uploader({ visible, setVisible }: UploaderProps) {
  const [selection, setSelection] = useState<FileList | null>(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelection(e.target.files);
  };

  const handleUpload = async () => {
    if (!selection || selection.length === 0) {
      alert('Please select images or a .zip.');
      return;
    }

    // Validate selection: either one .zip OR one/more images, but not both
    const files = Array.from(selection);
    const zips = files.filter(f => ext(f.name) === '.zip');
    const images = files.filter(f => f.type.startsWith('image/'));

    if (zips.length > 0 && images.length > 0) {
      alert('Pick either a .zip OR individual images — not both.');
      return;
    }
    if (zips.length > 1) {
      alert('Please upload a single .zip file.');
      return;
    }

    const datasetName = name?.trim() || `Dataset ${new Date().toLocaleString()}`;

    setBusy(true);
    try {
      const ds = await createDataset(datasetName);

      let filesToAdd: File[] = [];
      if (zips.length === 1) {
        filesToAdd = await extractZipImages(zips[0]);
        if (filesToAdd.length === 0) {
          alert('No images found inside the .zip.');
          setBusy(false);
          return;
        }
      } else {
        filesToAdd = images;
      }

      await addFiles(ds.id, filesToAdd);

      setSelection(null);
      setName('');
      alert(`Saved "${ds.name}" with ${filesToAdd.length} file(s).`);
      setVisible(false);
    } catch (e) {
      console.error(e);
      alert('Failed to save. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
      <label className="block text-sm font-medium text-gray-700">Dataset name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. 2026 Spring/Summer Collection"
        className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-4 space-y-2">
        <input
          type="file"
          accept=".zip,image/*"
          multiple
          onChange={handleChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
        {selection && selection.length > 0 && (
          <p className="text-sm text-gray-600">
            Selected {selection.length} file{selection.length > 1 ? 's' : ''}.
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={() => setVisible(false)}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
          disabled={busy}
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:opacity-50"
          disabled={busy}
        >
          {busy ? 'Uploading…' : 'Create dataset'}
        </button>
      </div>
    </div>
  );
}
