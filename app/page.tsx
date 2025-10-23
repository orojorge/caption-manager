'use client';

import { useState } from 'react';
// import MenuBar from './components/MenuBar';
import Menu from './components/Menu';
import DatasetList from './components/DatasetList';
import Uploader from './components/Uploader';
// import TaskLauncher from './components/TaskLauncher';

export default function Home() {
  const [uploaderVisible, setUploaderVisible] = useState(false);
  // const [taskVisible, setTaskVisible] = useState(false);

  return (
    <main className="flex min-h-screen bg-gray-50">
      <Menu />

      <section className="flex-1 flex flex-col items-center px-0 py-0 overflow-y-auto">
        <div className="mt-8 w-full max-w-3xl space-y-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Datasets</h1>
            <button
              onClick={() => setUploaderVisible((v) => !v)}
              className="text-blue-600 hover:underline"
            >
              Create New
            </button>
          </div>

          {uploaderVisible && (
            <Uploader visible={uploaderVisible} setVisible={setUploaderVisible} />
          )}

          <DatasetList />
        </div>
      </section>
    </main>
  );
}
