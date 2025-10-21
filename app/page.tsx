import Menu from './components/Menu';
import Uploader from './components/Uploader';
import TaskLauncher from './components/TaskLauncher';

export default function Home() {
  return (
    <main className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Menu />

      {/* Main content */}
      <section className="flex-1 flex flex-col items-center px-8 py-12 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Caption Manager 👋</h1>
        <p className="mt-2 text-gray-600">
          Upload datasets, manage profiles, and launch captioning tasks.
        </p>
        <div className="mt-8 w-full max-w-3xl space-y-10">
          <Uploader />
          <TaskLauncher />
        </div>
      </section>
    </main>
  );
}
