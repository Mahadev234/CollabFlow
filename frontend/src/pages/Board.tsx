// src/pages/Board.tsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { useBoardStore } from '../store/boardStore';
import Column from '../components/board/Column';
import CreateTaskModal from '../components/board/CreateTaskModal';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Board() {
  const { boardId } = useParams();
  const { currentBoard, setCurrentBoard, moveTask, subscribeToBoard } = useBoardStore();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  useEffect(() => {
    if (!boardId) return;
    
    const unsubscribe = subscribeToBoard(boardId);
    return () => unsubscribe();
  }, [boardId]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = currentBoard?.columns.find(
      col => col.id === source.droppableId
    );
    const destColumn = currentBoard?.columns.find(
      col => col.id === destination.droppableId
    );

    if (sourceColumn && destColumn) {
      await moveTask(draggableId, sourceColumn, destColumn);
    }
  };

  if (!currentBoard) return <div>Loading...</div>;

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentBoard.title}</h1>
          {currentBoard.description && (
            <p className="mt-1 text-sm text-gray-500">{currentBoard.description}</p>
          )}
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {currentBoard.columns.map(column => (
            <div key={column.id} className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-medium text-gray-900">{column.title}</h2>
                <button
                  onClick={() => {
                    setSelectedColumn(column.id);
                    setIsCreateTaskModalOpen(true);
                  }}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <Column column={column} />
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => {
          setIsCreateTaskModalOpen(false);
          setSelectedColumn(null);
        }}
        columnId={selectedColumn}
      />
    </div>
  );
}