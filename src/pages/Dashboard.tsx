import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBoardStore } from '../store/boardStore';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { boards, createBoard } = useBoardStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  const handleCreateBoard = () => {
    const title = prompt('Enter board title:');
    if (title) {
      const newBoard = createBoard(title);
      navigate(`/board/${newBoard.id}`);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Boards</h1>
        <button
          onClick={handleCreateBoard}
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5" />
          Create Board
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => navigate(`/board/${board.id}`)}
            className="cursor-pointer rounded-lg border bg-white p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-lg font-medium text-gray-900">{board.title}</h2>
            <p className="mt-2 text-sm text-gray-500">
              {board.columns.length} columns
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}