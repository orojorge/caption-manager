'use client';

type MenuBarProps = {
  onNewDataset: () => void;
};

export default function MenuBar({ onNewDataset }: MenuBarProps) {
  return (
    <header className="flex w-full items-center justify-between bg-gray-50 px-4 py-4">
      <button
        onClick={onNewDataset}
        className="rounded-sm border border-black px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
      >
        New Dataset
      </button>

      <button className="rounded-sm border border-black px-4 py-2 text-sm font-medium text-black hover:bg-gray-200">
        New Task
      </button>
    </header>
  );
}
