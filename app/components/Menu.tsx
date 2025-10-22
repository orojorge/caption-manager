'use client';

import DatasetList from './DatasetList';
import Profiles from './Profiles';
import ProfilesList from './ProfilesList';

export default function Menu() {
  return (
    <aside className="w-full max-w-xs h-screen overflow-y-auto border-r border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Sartiq.ai</h2>
      <div className="space-y-10">
        <DatasetList />
        <ProfilesList />
      </div>
    </aside>
  );
}
