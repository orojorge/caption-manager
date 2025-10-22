'use client';

import Link from "next/link";
import DatasetList from './DatasetList';
import Profiles from './Profiles';
import ProfilesList from './ProfilesList';

export default function Menu() {
  return (
    <aside className="w-full max-w-xs h-screen overflow-y-auto bg-white p-4">
      <div className="mb-4 text-xl font-semibold text-gray-800">
        <Link href="/">Sartiq.ai</Link>
      </div>
      <div className="space-y-4">
        <DatasetList />
        <ProfilesList />
      </div>
    </aside>
  );
}
