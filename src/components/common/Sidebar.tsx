import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4">
      <nav className="space-y-1">
        <Link
          to="/"
          className="flex items-center rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50"
        >
          Dashboard
        </Link>
        <Link
          to="/board/1"
          className="flex items-center rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50"
        >
          Project Board
        </Link>
      </nav>
    </aside>
  );
}