import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import { toast } from 'react-hot-toast';

interface ProjectData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  members: string[];
}

export default function CreateProject() {
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    members: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();
  const { createProject } = useProjectStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) throw new Error('User not authenticated');
      
      // Add the current user as a member
      const projectDataWithMembers = {
        ...projectData,
        members: [...projectData.members, user.uid]
      };

      await createProject(projectDataWithMembers);
      toast.success('Project created successfully!');
      navigate('/projects');
    } catch (error: any) {
      setError(error.message || 'Failed to create project');
      toast.error(error.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
            Create New Project
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Start collaborating with your team on a new project
          </p>
        </div>
        
        <div className="rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm ring-1 ring-black/5">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="rounded-xl bg-red-50 p-4 shadow-sm ring-1 ring-red-200">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-100 p-2">
                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="name"
                    value={projectData.name}
                    onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                    className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    value={projectData.description}
                    onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                    className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
                    rows={4}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      id="startDate"
                      value={projectData.startDate}
                      onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                      className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      id="endDate"
                      value={projectData.endDate}
                      onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
                      className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating Project...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Project
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 