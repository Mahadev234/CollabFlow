import { Draggable } from '@hello-pangea/dnd';
import { Task as TaskType } from '../../types/board';
import { CalendarIcon, UserCircleIcon, TagIcon } from '@heroicons/react/24/outline';

interface Props {
  task: TaskType;
  index: number;
}

export default function Task({ task, index }: Props) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 rounded-lg bg-white p-4 shadow-sm ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
          
          {task.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
            
            {task.assignees.length > 0 && (
              <div className="flex items-center gap-1">
                <UserCircleIcon className="h-4 w-4" />
                {task.assignees.length}
              </div>
            )}
            
            {task.labels.length > 0 && (
              <div className="flex items-center gap-1">
                <TagIcon className="h-4 w-4" />
                {task.labels.length}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}