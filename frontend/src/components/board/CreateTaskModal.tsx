import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useBoardStore } from '../../store/boardStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  columnId: string | null;
}

export default function CreateTaskModal({ isOpen, onClose, columnId }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createTask } = useBoardStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && columnId) {
      createTask(columnId, {
        title,
        description,
        assignees: [],
        labels: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      onClose();
    }
  };

  return (
    <Transition show={isOpen} as={Dialog} onClose={onClose}>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center">
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <div className="relative mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <Dialog.Title className="text-lg font-medium text-gray-900">
              Create New Task
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  );
} 