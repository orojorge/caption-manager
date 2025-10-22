'use client';

import Link from 'next/link';
import DatasetList from './DatasetList';
import Profiles from './Profiles';

export default function Menu() {
  return (
    <aside className="w-full max-w-xs h-screen overflow-y-auto border-r border-gray-200 bg-white p-6">
      <p className="mb-4 text-xl font-semibold text-black">
        <Link href="/">Sartiq.ai</Link>
      </p>
      <div className="space-y-10">
        <DatasetList />
        <Profiles />
      </div>
    </aside>
  );
}
