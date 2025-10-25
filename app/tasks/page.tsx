'use client';

import Menu from '../components/Menu';
import TaskLauncher from '../components/TaskLauncher';

export default function TasksPage() {
  return (
    <main className="flex min-h-screen bg-gray-100">
      <Menu />

      <section className="flex-1 h-screen overflow-auto px-8 py-8">
        <div className="max-w-4xl">
						<div className="mb-6 flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-semibold text-gray-900">Tasks Launcher</h1>
								<p className="text-sm text-gray-600">Caption datasets with AI</p>
							</div>
						</div>

					<TaskLauncher />
				</div>
			</section>
		</main>
  );
}
