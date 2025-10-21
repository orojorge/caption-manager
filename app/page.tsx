import Uploader from './components/Uploader';
import DatasetList from './components/DatasetList';
import Profiles from './components/Profiles';
import TaskLauncher from './components/TaskLauncher';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Caption Manager 👋</h1>
      <p className="mt-2 text-gray-600">Datasets, Profiles, and mock captioning tasks.</p>
      <Uploader />
      <DatasetList />
      <Profiles />
      <TaskLauncher />
    </main>
  );
}
