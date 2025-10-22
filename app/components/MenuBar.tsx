'use client';

type MenuBarProps = {
  onNewDataset: () => void;
  onNewTask: () => void;
};

export default function MenuBar({ onNewDataset, onNewTask }: MenuBarProps) {
  return (
    <>
      <header className="flex w-full items-center justify-between bg-white px-4 py-4">
        <button
					onClick={onNewDataset}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
        >
          New Dataset
        </button>

        <button
					className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-black hover:bg-gray-200"
					onClick={onNewTask}
				>
          New Task
        </button>
      </header>
    </>
  );
}
