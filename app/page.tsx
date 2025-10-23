'use client';

import { useState } from 'react';
// import MenuBar from './components/MenuBar';
import Menu from './components/Menu';
import DatasetList from './components/DatasetList';
import Uploader from './components/Uploader';
import TaskLauncher from './components/TaskLauncher';

export default function Home() {
  const [uploaderVisible, setUploaderVisible] = useState(true);
  const [taskVisible, setTaskVisible] = useState(false);

  return (
    <main className="flex min-h-screen bg-gray-50">
      <Menu />

      <section className="flex-1 flex flex-col items-center px-0 py-0 overflow-y-auto">
        {/* <MenuBar
          onNewDataset={() => setUploaderVisible(true)}
          onNewTask={() => setTaskVisible(true)}
        /> */}
        
        <div className="mt-8 w-full max-w-3xl space-y-10">
          <DatasetList />
          <Uploader visible={uploaderVisible} setVisible={setUploaderVisible} />
          <TaskLauncher visible={taskVisible} setVisible={setTaskVisible} />
        </div>
      </section>
    </main>
  );
}
