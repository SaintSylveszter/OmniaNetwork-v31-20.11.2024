import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { FolderPlus, Edit2, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { Switch } from '@headlessui/react';

interface Category {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  meta_description: string | null;
  is_active: boolean;
  parent_id: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
  isExpanded?: boolean;
}

interface CategoryListProps {
  category: Category;
  index: number;
  subcategories: Category[];
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onAddSubcategory: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  category,
  index,
  subcategories,
  onToggleActive,
  onEdit,
  onDelete,
  onAddSubcategory,
  isExpanded,
  onToggleExpand
}) => {
  return (
    <Draggable draggableId={String(category.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="space-y-2"
        >
          <div className="bg-gray-700/50 rounded-lg p-4 flex items-center">
            <div {...provided.dragHandleProps} className="mr-4">
              <GripVertical size={16} className="text-gray-400" />
            </div>
            <button
              onClick={onToggleExpand}
              className="mr-4 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
            <div className="flex-1 text-gray-100">{category.name}</div>
            <div className="flex items-center space-x-4">
              <Switch
                checked={category.is_active}
                onChange={() => onToggleActive(category.id, category.is_active)}
                className={`${
                  category.is_active ? 'bg-green-600' : 'bg-red-600'
                } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                <span
                  className={`${
                    category.is_active ? 'translate-x-5' : 'translate-x-1'
                  } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onAddSubcategory}
                  className="text-indigo-400 hover:text-indigo-300"
                  title="Add Subcategory"
                >
                  <FolderPlus size={16} />
                </button>
                <button
                  onClick={() => onEdit(category)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {isExpanded && subcategories.length > 0 && (
            <Droppable droppableId={`subcategories-${String(category.id)}`}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="pl-8 space-y-2"
                >
                  {subcategories.map((subcategory, subIndex) => (
                    <Draggable
                      key={String(subcategory.id)} 
                      draggableId={String(subcategory.id)} 
                      index={subIndex}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-gray-800 rounded-lg p-4 flex items-center"
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
          )}
        </div>
      )}
    </Draggable>
  );
};

export default CategoryList;