'use client';

import DatasetList from './DatasetList';
import Profiles from './Profiles';

export default function Menu() {
  return (
    <aside className="w-full max-w-xs h-screen overflow-y-auto border-r border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Menu</h2>
      <div className="space-y-10">
        <DatasetList />
        <Profiles />
      </div>
    </aside>
  );
}
