import MenuBar from './components/MenuBar';
import Menu from './components/Menu';
import DatasetList from './components/DatasetList';
import Uploader from './components/Uploader';
import TaskLauncher from './components/TaskLauncher';

export default function Home() {
  return (
    <main className="flex min-h-screen bg-gray-50">
      <Menu />

      <section className="flex-1 flex flex-col items-center px-0 py-0 overflow-y-auto">
        <MenuBar />
        
        <div className="mt-8 w-full max-w-3xl space-y-10">
          <DatasetList />
          {/* <Uploader /> */}
          {/* <TaskLauncher /> */}
        </div>
      </section>
    </main>
  );
}
