// src/store/boardStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Task, Column, Board } from '../types/board';

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  tasks: { [key: string]: Task };
  loading: boolean;
  error: string | null;
  setCurrentBoard: (board: Board) => void;
  moveTask: (taskId: string, source: Column, destination: Column) => Promise<void>;
  createBoard: (title: string, description?: string) => Promise<void>;
  createTask: (columnId: string, taskData: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addColumn: (title: string) => Promise<void>;
  updateColumn: (columnId: string, updates: Partial<Column>) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  subscribeToBoard: (boardId: string) => () => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  currentBoard: null,
  tasks: {},
  loading: false,
  error: null,
  
  setCurrentBoard: (board) => set({ currentBoard: board }),
  
  createBoard: async (title, description) => {
    set({ loading: true, error: null });
    try {
      const boardId = uuidv4();
      const newBoard: Board = {
        id: boardId,
        title,
        description,
        columns: [
          { id: uuidv4(), title: 'To Do', taskIds: [] },
          { id: uuidv4(), title: 'In Progress', taskIds: [] },
          { id: uuidv4(), title: 'Done', taskIds: [] },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'boards', boardId), newBoard);
      set((state) => ({ boards: [...state.boards, newBoard] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  
  createTask: async (columnId, taskData) => {
    set({ loading: true, error: null });
    try {
      const taskId = uuidv4();
      const newTask: Task = {
        id: taskId,
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const { currentBoard } = get();
      if (!currentBoard) throw new Error('No board selected');
      
      const boardRef = doc(db, 'boards', currentBoard.id);
      const updatedColumns = currentBoard.columns.map(column =>
        column.id === columnId
          ? { ...column, taskIds: [...column.taskIds, taskId] }
          : column
      );
      
      await updateDoc(boardRef, {
        columns: updatedColumns,
        updatedAt: new Date().toISOString(),
      });
      
      await setDoc(doc(db, 'tasks', taskId), newTask);
      
      set((state) => ({
        tasks: { ...state.tasks, [taskId]: newTask },
        currentBoard: {
          ...currentBoard,
          columns: updatedColumns,
        },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  
  updateTask: async (taskId, updates) => {
    set({ loading: true, error: null });
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      
      set((state) => ({
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  
  deleteTask: async (taskId) => {
    set({ loading: true, error: null });
    try {
      const { currentBoard } = get();
      if (!currentBoard) throw new Error('No board selected');
      
      const boardRef = doc(db, 'boards', currentBoard.id);
      const updatedColumns = currentBoard.columns.map(column => ({
        ...column,
        taskIds: column.taskIds.filter(id => id !== taskId),
      }));
      
      await updateDoc(boardRef, {
        columns: updatedColumns,
        updatedAt: new Date().toISOString(),
      });
      
      await deleteDoc(doc(db, 'tasks', taskId));
      
      set((state) => {
        const newTasks = { ...state.tasks };
        delete newTasks[taskId];
        
        return {
          tasks: newTasks,
          currentBoard: {
            ...currentBoard,
            columns: updatedColumns,
          },
        };
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  
  moveTask: async (taskId, source, destination) => {
    set({ loading: true, error: null });
    try {
      const { currentBoard } = get();
      if (!currentBoard) throw new Error('No board selected');
      
      const boardRef = doc(db, 'boards', currentBoard.id);
      const updatedColumns = currentBoard.columns.map(column => {
        if (column.id === source.id) {
          return {
            ...column,
            taskIds: column.taskIds.filter(id => id !== taskId),
          };
        }
        if (column.id === destination.id) {
          return {
            ...column,
            taskIds: [...column.taskIds, taskId],
          };
        }
        return column;
      });
      
      await updateDoc(boardRef, {
        columns: updatedColumns,
        updatedAt: new Date().toISOString(),
      });
      
      set({
        currentBoard: {
          ...currentBoard,
          columns: updatedColumns,
        },
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  
  subscribeToBoard: (boardId) => {
    const unsubscribe = onSnapshot(doc(db, 'boards', boardId), (doc) => {
      if (doc.exists()) {
        const boardData = doc.data() as Board;
        set({ currentBoard: boardData });
      }
    });
    
    return unsubscribe;
  },

  addColumn: async (title) => {
    set({ loading: true, error: null });
    try {
      const { currentBoard } = get();
      if (!currentBoard) throw new Error('No board selected');
      
      const newColumn = { id: uuidv4(), title, taskIds: [] };
      const boardRef = doc(db, 'boards', currentBoard.id);
      
      await updateDoc(boardRef, {
        columns: [...currentBoard.columns, newColumn],
        updatedAt: new Date().toISOString(),
      });
      
      set(() => ({
        currentBoard: {
          ...currentBoard,
          columns: [...currentBoard.columns, newColumn],
        },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateColumn: async (columnId, updates) => {
    set({ loading: true, error: null });
    try {
      const { currentBoard } = get();
      if (!currentBoard) throw new Error('No board selected');
      
      const boardRef = doc(db, 'boards', currentBoard.id);
      const updatedColumns = currentBoard.columns.map(column =>
        column.id === columnId ? { ...column, ...updates } : column
      );
      
      await updateDoc(boardRef, {
        columns: updatedColumns,
        updatedAt: new Date().toISOString(),
      });
      
      set({
        currentBoard: {
          ...currentBoard,
          columns: updatedColumns,
        },
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteColumn: async (columnId) => {
    set({ loading: true, error: null });
    try {
      const { currentBoard } = get();
      if (!currentBoard) throw new Error('No board selected');
      
      const boardRef = doc(db, 'boards', currentBoard.id);
      const updatedColumns = currentBoard.columns.filter(col => col.id !== columnId);
      
      await updateDoc(boardRef, {
        columns: updatedColumns,
        updatedAt: new Date().toISOString(),
      });
      
      set({
        currentBoard: {
          ...currentBoard,
          columns: updatedColumns,
        },
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));