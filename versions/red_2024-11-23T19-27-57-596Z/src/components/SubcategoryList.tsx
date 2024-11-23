import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { Switch } from '@headlessui/react';

interface SubcategoryListProps {
  parentId: string;
  subcategories: Array<{
    id: string;
    name: string;
    is_active: boolean;
  }>;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onEdit: (subcategory: any) => void;
  onDelete: (id: string) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
  parentId,
  subcategories,
  onToggleActive,
  onEdit,
  onDelete
}) => {
  return (
    <Droppable droppableId={`subcategories-${parentId}`}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="pl-8"
        >
          {subcategories.map((subcategory, index) => (
            <Draggable
              key={subcategory.id}
              draggableId={subcategory.id}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className="bg-gray-800 rounded-lg p-4 mb-2 flex items-center"
                >
                  <div {...provided.dragHandleProps} className="mr-4">
                    <GripVertical size={16} className="text-gray-400" />
                  </div>
                  <div className="flex-1 text-gray-100">
                    {subcategory.name}
                  </div>
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={subcategory.is_active}
                      onChange={() => onToggleActive(subcategory.id, subcategory.is_active)}
                      className={`${
                        subcategory.is_active ? 'bg-green-600' : 'bg-red-600'
                      } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          subcategory.is_active ? 'translate-x-5' : 'translate-x-1'
                        } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(subcategory)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(subcategory.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default SubcategoryList;