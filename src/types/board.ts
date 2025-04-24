export interface Task {
    id: string;
    title: string;
    description: string;
    assignees: string[];
    dueDate?: Date;
    labels: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Column {
    id: string;
    title: string;
    taskIds: string[];
  }
  
  export interface Board {
    id: string;
    title: string;
    description?: string;
    columns: Column[];
    createdAt: string;
    updatedAt: string;
  }