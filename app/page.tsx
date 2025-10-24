'use client';

import { useState } from 'react';
import Menu from './components/Menu';
import DatasetList from './components/DatasetList';
import Uploader from './components/Uploader';
import UploaderZip from './components/UploaderZip';

export default function Home() {
  const [uploaderVisible, setUploaderVisible] = useState(false);

  return (
    <main className="flex min-h-screen bg-gray-50">
      <Menu />

      <section className="flex-1 h-screen overflow-auto bg-gray-50 px-8 py-8">
        <div className="max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Datasets</h1>
                <p className="text-sm text-gray-600">Create and explore datasets</p>
              </div>
          </div>

          <div className="mb-4">
            <button
              onClick={() => setUploaderVisible((v) => !v)}
              className="text-sm text-blue-600 hover:underline"
            >
              {uploaderVisible ? 'Cancel' : 'Create New'}
            </button>
          </div>

          {uploaderVisible && (
            // <Uploader visible={uploaderVisible} setVisible={setUploaderVisible} />
            <UploaderZip visible={uploaderVisible} setVisible={setUploaderVisible} />
          )}

          <DatasetList />
        </div>
      </section>
    </main>
  );
}
