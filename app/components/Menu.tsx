'use client';

import Link from "next/link";
import DatasetList from './DatasetList';
import ProfilesList from './ProfilesList';

export default function Menu() {
  return (
    <aside className="w-full max-w-xs h-screen overflow-y-auto bg-white p-4">
      <div className="mb-4 text-xl font-semibold">
        {/* <Link href="/">Sartiq.ai</Link> */}
        Sartiq.ai
      </div>
      <div className="space-y-4">
        <h2 className="mb-3 text-lg font-semibold">
          <Link href="/">Datasets</Link>
        </h2>
        <DatasetList />
        <h2 className="mb-3 text-lg font-semibold">
          <Link href="/profiles">Profiles</Link>
        </h2>
        <ProfilesList />
        <h2 className="mb-3 text-lg font-semibold">
          <Link href="/tasks">Tasks</Link>
        </h2>
      </div>
    </aside>
  );
}
