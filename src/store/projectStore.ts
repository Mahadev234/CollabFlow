import { create } from 'zustand';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthStore } from './authStore';

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<void>;
  updateProject: (projectId: string, projectData: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  fetchProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,

  createProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');

      const now = new Date().toISOString();
      const newProject: Project = {
        ...projectData,
        id: '', // Will be set by Firestore
        createdAt: now,
        updatedAt: now,
        createdBy: user.uid,
      };

      const projectRef = await addDoc(collection(db, 'projects'), newProject);
      newProject.id = projectRef.id;

      set((state) => ({
        projects: [...state.projects, newProject],
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateProject: async (projectId, projectData) => {
    set({ loading: true, error: null });
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: new Date().toISOString(),
      });

      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? { ...project, ...projectData, updatedAt: new Date().toISOString() }
            : project
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== projectId),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');

      const projectsQuery = query(
        collection(db, 'projects'),
        where('members', 'array-contains', user.uid)
      );
      const projectsSnapshot = await getDocs(projectsQuery);
      const projects = projectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      set({ projects, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
})); 