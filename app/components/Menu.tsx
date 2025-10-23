'use client';

import Link from "next/link";
import DatasetList from './DatasetList';
import ProfilesList from './ProfilesList';

export default function Menu() {
  return (
    <aside className="w-full max-w-xs h-screen overflow-y-auto bg-white p-4">
      <div className="mb-4 text-xl font-semibold">
        <Link href="/">Sartiq.ai</Link>
      </div>
      <div className="space-y-4">
        <DatasetList />
        <ProfilesList />
        <h2 className="mb-3 text-lg font-semibold">
          <Link href="/tasks">Tasks</Link>
        </h2>
      </div>
    </aside>
  );
}
