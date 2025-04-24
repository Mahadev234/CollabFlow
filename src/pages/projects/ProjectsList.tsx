import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { toast } from 'react-hot-toast';

export default function ProjectsList() {
  const { projects, loading, error, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects().catch((error) => {
      toast.error(error.message || 'Failed to fetch projects');
    });
  }, [fetchProjects]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-lg font-medium text-blue-700">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
        <div className="rounded-2xl bg-red-50 p-8 shadow-xl ring-1 ring-red-200">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-red-100 p-3">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-center text-lg font-medium text-red-700">{error}</p>
            <button
              onClick={() => fetchProjects()}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              Your Projects
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Collaborate and manage your projects efficiently
            </p>
          </div>
          <Link
            to="/projects/create"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl hover:shadow-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Project
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm ring-1 ring-black/5 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 hover:ring-black/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {project.name}
                  </h2>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {project.members.length} members
                  </span>
                </div>
                <p className="mb-6 text-sm text-gray-600 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Due {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-md rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm ring-1 ring-black/5">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-blue-100 p-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">No projects yet</h2>
              <p className="mb-6 text-gray-600">
                Create your first project to get started with CollabFlow
              </p>
              <Link
                to="/projects/create"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl hover:shadow-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 