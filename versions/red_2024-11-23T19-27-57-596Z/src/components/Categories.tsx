import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { getConnection } from '../lib/db/connections';
import sql from '../lib/db/neon';
import CategoryModal from './modals/CategoryModal';
import CategoryList from './CategoryList';

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

const Categories: React.FC = () => {
  const { adminName } = useParams<{ adminName: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [connectionString, setConnectionString] = useState<string | null>(null);
  const [allExpanded, setAllExpanded] = useState(true);
  const [expansionState, setExpansionState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (adminName) {
      getConnectionString();
    }
  }, [adminName]);

  useEffect(() => {
    if (connectionString) {
      createCategoriesTable();
    }
  }, [connectionString]);

  const getConnectionString = async () => {
    try {
      const [admin] = await sql<[{ connection_string: string }]>`
        SELECT connection_string 
        FROM admins 
        WHERE username = ${adminName}
        AND status = 'active'
        LIMIT 1
      `;

      if (!admin?.connection_string) {
        throw new Error('No database connection found for this site');
      }

      setConnectionString(admin.connection_string);
    } catch (error) {
      console.error('Error getting connection string:', error);
      setError('Failed to connect to site database');
      setIsLoading(false);
    }
  };

  const createCategoriesTable = async () => {
    if (!connectionString) return;

    try {
      const siteDb = getConnection(connectionString);
      
      // Create categories table if it doesn't exist
      await siteDb`
        CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255),
          subtitle VARCHAR(300),
          description TEXT,
          meta_description VARCHAR(255),
          is_active BOOLEAN DEFAULT true,
          display_order INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create indexes
      await siteDb`
        CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id)
      `;

      await siteDb`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug) 
        WHERE slug IS NOT NULL
      `;

      await loadCategories();
    } catch (err) {
      console.error('Error creating categories table:', err);
      setError('Failed to initialize categories');
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    if (!connectionString) return;

    try {
      setIsLoading(true);
      const siteDb = getConnection(connectionString);
      const data = await siteDb<Category[]>`
        SELECT * FROM categories 
        ORDER BY parent_id NULLS FIRST, display_order ASC
      `;
      
      const categoriesWithExpanded = data.map(category => ({
        ...category,
        isExpanded: expansionState[category.id] ?? allExpanded
      }));
      
      setCategories(categoriesWithExpanded);
      setError(null);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'display_order'>) => {
    if (!connectionString) return;

    try {
      const siteDb = getConnection(connectionString);

      // Generate a URL-friendly slug if not provided
      const slug = data.slug || data.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (selectedCategory) {
        // Update existing category
        await siteDb`
          UPDATE categories 
          SET 
            name = ${data.name},
            slug = ${slug},
            subtitle = ${data.subtitle || null},
            description = ${data.description || null},
            meta_description = ${data.meta_description || null},
            is_active = ${data.is_active},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${selectedCategory.id}
        `;
      } else {
        // Get the next display order value
        const [maxOrder] = await siteDb`
          SELECT COALESCE(MAX(display_order), 0) + 10 as next_order
          FROM categories
          WHERE parent_id IS NOT DISTINCT FROM ${parentCategory?.id}
        `;

        // Insert new category
        await siteDb`
          INSERT INTO categories (
            name,
            slug,
            subtitle,
            description,
            meta_description,
            is_active,
            parent_id,
            display_order
          ) VALUES (
            ${data.name},
            ${slug},
            ${data.subtitle || null},
            ${data.description || null},
            ${data.meta_description || null},
            ${data.is_active},
            ${parentCategory?.id || null},
            ${maxOrder.next_order}
          )
        `;
      }

      await loadCategories();
      setError(null);
      setIsModalOpen(false);
      setSelectedCategory(null);
      setParentCategory(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to save category: ${err.message}`);
      } else {
        setError('Failed to save category');
      }
    }
  };

  const toggleAllCategories = () => {
    const newExpandedState = !allExpanded;
    setAllExpanded(newExpandedState);
    
    const newExpansionState = categories.reduce((acc, category) => ({
      ...acc,
      [category.id]: newExpandedState
    }), {});
    setExpansionState(newExpansionState);
    
    setCategories(categories.map(category => ({
      ...category,
      isExpanded: newExpandedState
    })));
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = !expansionState[categoryId];
    setExpansionState(prev => ({
      ...prev,
      [categoryId]: newExpanded
    }));
    
    setCategories(categories.map(category => 
      category.id === categoryId 
        ? { ...category, isExpanded: newExpanded }
        : category
    ));
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    if (!connectionString) return;

    try {
      const siteDb = getConnection(connectionString);
      await siteDb`
        UPDATE categories 
        SET 
          is_active = ${!currentStatus},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
      await loadCategories();
    } catch (err) {
      console.error('Error toggling category status:', err);
      setError('Failed to update category status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!connectionString || !window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const siteDb = getConnection(connectionString);
      await siteDb`DELETE FROM categories WHERE id = ${id}`;
      
      const newExpansionState = { ...expansionState };
      delete newExpansionState[id];
      setExpansionState(newExpansionState);
      
      await loadCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setParentCategory(category.parent_id ? categories.find(c => c.id === category.parent_id) || null : null);
    setIsModalOpen(true);
  };

  const updateOrder = async (id: string, newOrder: number) => {
    if (!connectionString) return;
  
    try {
      const siteDb = getConnection(connectionString);
      const safeOrder = Math.floor(newOrder);
      
      await siteDb`
        UPDATE categories 
        SET 
          display_order = ${safeOrder},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
      
      const data = await siteDb<Category[]>`
        SELECT * FROM categories 
        ORDER BY parent_id NULLS FIRST, display_order ASC
      `;
      
      setCategories(data.map(category => ({
        ...category,
        id: String(category.id), // Asigură-te că id-ul este string
        parent_id: category.parent_id ? String(category.parent_id) : null,
        isExpanded: expansionState[String(category.id)] ?? allExpanded
      })));
    } catch (err) {
      console.error('Error updating category order:', err);
      setError('Failed to update category order');
    }
  };

  const onDragEnd = async (result: any) => {
  if (!result.destination || !connectionString) return;

  const { source, destination, draggableId } = result;
  if (source.index === destination.index && source.droppableId === destination.droppableId) return;

    try {
      // Găsim categoria folosind String(draggableId) pentru a ne asigura că comparăm string cu string
      const category = categories.find(c => String(c.id) === String(draggableId));
      if (!category) return;
  
      // Convertim ID-urile la string când extragem parent ID
      const sourceParentId = source.droppableId === 'categories' ? null : 
        String(source.droppableId.replace('subcategories-', ''));
      const destinationParentId = destination.droppableId === 'categories' ? null : 
        String(destination.droppableId.replace('subcategories-', ''));

      if (sourceParentId !== destinationParentId) {
        return; // Prevent changing parent
      }

      // Filtrăm categoriile relevante, asigurându-ne că comparăm string cu string
      const relevantCategories = categories.filter(c => 
        (sourceParentId === null ? !c.parent_id : String(c.parent_id) === sourceParentId)
      );
  
      const sortedCategories = [...relevantCategories].sort((a, b) => 
        a.display_order - b.display_order
      );
  
      let newOrder: number;
      if (destination.index === 0) {
        newOrder = sortedCategories[0]?.display_order 
          ? Math.floor(sortedCategories[0].display_order / 2)
          : 10;
      } else if (destination.index >= sortedCategories.length) {
        const lastOrder = sortedCategories[sortedCategories.length - 1]?.display_order || 0;
        newOrder = lastOrder + 10;
      } else {
        const prevOrder = sortedCategories[destination.index - 1].display_order;
        const nextOrder = sortedCategories[destination.index].display_order;
        newOrder = Math.floor(prevOrder + (nextOrder - prevOrder) / 2);
      }
  
      // Asigură-te că draggableId este string când îl trimiți la updateOrder
      await updateOrder(String(draggableId), newOrder);

    } catch (err) {
      console.error('Error reordering categories:', err);
      setError('Failed to reorder categories');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-400">Loading categories...</div>
      </div>
    );
  }

  const parentCategories = categories.filter(category => !category.parent_id);
  const getSubcategories = (parentId: string) => categories.filter(category => category.parent_id === parentId);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">Categories</h2>
            <button
              onClick={toggleAllCategories}
              className="flex items-center px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {allExpanded ? (
                <>
                  <ChevronDown size={16} className="mr-1" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronRight size={16} className="mr-1" />
                  Expand All
                </>
              )}
            </button>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setParentCategory(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Plus size={20} className="mr-2" />
            Add New Category
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/30 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {parentCategories.map((category, index) => (
                  <CategoryList
                    key={category.id}
                    category={category}
                    index={index}
                    subcategories={getSubcategories(category.id)}
                    onToggleActive={toggleActive}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddSubcategory={() => {
                      setSelectedCategory(null);
                      setParentCategory(category);
                      setIsModalOpen(true);
                    }}
                    isExpanded={category.isExpanded}
                    onToggleExpand={() => toggleCategory(category.id)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
            setParentCategory(null);
          }}
          onSubmit={handleSubmit}
          category={selectedCategory}
          parentCategory={parentCategory}
        />
      </div>
    </div>
  );
};

export default Categories;