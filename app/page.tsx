import Uploader from './components/Uploader';
import DatasetList from './components/DatasetList';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Caption Manager 👋</h1>
      <p className="mt-2 text-gray-600">Save image datasets locally with IndexedDB.</p>
      <Uploader />
      <DatasetList />
    </main>
  );
}
