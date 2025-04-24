import { Droppable } from '@hello-pangea/dnd';
import Task from './Task';
import { Column as ColumnType } from '../../types/board';
import { useBoardStore } from '../../store/boardStore';

interface Props {
  column: ColumnType;
}

export default function Column({ column }: Props) {
  const tasks = useBoardStore(state => 
    column.taskIds.map(id => state.tasks[id])
  );

  return (
    <div className="w-72 flex-shrink-0">
      <div className="rounded-lg bg-gray-100 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">{column.title}</h3>
          <span className="text-sm text-gray-500">{tasks.length}</span>
        </div>
        
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[200px] rounded-md ${
                snapshot.isDraggingOver ? 'bg-gray-200' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}