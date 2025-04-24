import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBoardStore } from '../store/boardStore';
import { 
  PlusIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  ClockIcon,
  DocumentTextIcon,
  CalendarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { boards, createBoard } = useBoardStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  const handleCreateBoard = async () => {
    const title = prompt('Enter board title:');
    if (title) {
      try {
        const newBoard = await createBoard(title);
        navigate(`/board/${newBoard.id}`);
      } catch (error) {
        console.error('Failed to create board:', error);
      }
    }
  };

  // Mock data for demonstration
  const recentActivity = [
    { id: 1, action: 'Created new board', board: 'Project Alpha', time: '2 hours ago' },
    { id: 2, action: 'Updated task', board: 'Marketing Campaign', time: '4 hours ago' },
    { id: 3, action: 'Added team member', board: 'Development Sprint', time: '1 day ago' },
  ];

  const quickActions = [
    { icon: PlusIcon, label: 'Create Board', action: handleCreateBoard },
    { icon: UserGroupIcon, label: 'Invite Team', action: () => navigate('/team') },
    { icon: DocumentTextIcon, label: 'View Reports', action: () => navigate('/reports') },
    { icon: CalendarIcon, label: 'Schedule Meeting', action: () => navigate('/calendar') },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.email?.split('@')[0]}!</h1>
            <p className="mt-1 text-gray-500">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{boards.length}</div>
              <div className="text-sm text-gray-500">Active Boards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">12</div>
              <div className="text-sm text-gray-500">Team Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <action.icon className="h-6 w-6 text-indigo-600" />
            <span className="text-sm font-medium text-gray-900">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <ClockIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.board}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boards Overview */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Boards</h2>
            <button
              onClick={handleCreateBoard}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5" />
              Create Board
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {boards.map((board) => (
              <div
                key={board.id}
                onClick={() => navigate(`/board/${board.id}`)}
                className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{board.title}</h3>
                  <ChartBarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>{board.columns.length} columns</span>
                  <span className="mx-2">•</span>
                  <span>5 tasks</span>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">+2 more</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}