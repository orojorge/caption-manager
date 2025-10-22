'use client';

import { useState } from 'react';
import Uploader from './Uploader';

export default function MenuBar() {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <>
      <header className="flex w-full items-center justify-between bg-white px-4 py-4">
        <button
          onClick={() => setShowUploader((prev) => !prev)}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
        >
          New Dataset
        </button>

        <button className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-black hover:bg-gray-200">
          New Task
        </button>
      </header>

      {showUploader && <Uploader />}
    </>
  );
}
