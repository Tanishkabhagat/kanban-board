import React, { useState, useEffect, useRef } from 'react';
import KanbanColumn from './KanbanColumn';
import AddCardModal from './AddCardModal';
import EditCardModal from './EditCardModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

// Define a palette of pastel colors for cards and background themes
const pastelColors = [
  { name: 'Blue', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  { name: 'Green', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  { name: 'Pink', bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  { name: 'Yellow', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  { name: 'Purple', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  { name: 'Gray', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
];

const backgroundThemes = [
  { name: 'Blue-Purple', class: 'from-blue-100 to-purple-200' },
  { name: 'Green-Yellow', class: 'from-green-100 to-yellow-200' },
  { name: 'Pink-Orange', class: 'from-pink-100 to-orange-200' },
  { name: 'Gray-Blue', class: 'from-gray-100 to-blue-200' },
];

// Default initial columns data
const defaultColumns = {
  'todo': {
    name: 'To Do',
    tasks: [
      { id: 'task-1', content: 'Set up Next.js project', color: pastelColors[0].bg },
      { id: 'task-2', content: 'Design basic UI layout', color: pastelColors[1].bg },
      { id: 'task-5', content: 'Write initial documentation', color: pastelColors[2].bg },
    ],
  },
  'in-progress': {
    name: 'In Progress',
    tasks: [
      { id: 'task-3', content: 'Implement drag-and-drop functionality', color: pastelColors[3].bg },
    ],
  },
  'done': {
    name: 'Done',
    tasks: [
      { id: 'task-4', content: 'Plan Kanban board features', color: pastelColors[4].bg },
    ],
  },
};

// Function to generate a unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};


const KanbanBoard = () => {
  const [columns, setColumns] = useState(defaultColumns);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [draggedFromColumnId, setDraggedFromColumnId] = useState(null);
  const [hoveredColumnId, setHoveredColumnId] = useState(null);
  const [insertionPoint, setInsertionPoint] = useState(null);
  const [currentBgThemeIndex, setCurrentBgThemeIndex] = useState(0);
  const [openColorPickerCard, setOpenColorPickerCard] = useState(null);

  // Add Card Modal states
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardContent, setNewCardContent] = useState('');
  const [addCardColumnTarget, setAddCardColumnTarget] = useState(null);

  // Edit Card Modal states
  const [showEditCardModal, setShowEditCardModal] = useState(false);
  const [editingCardContent, setEditingCardContent] = useState('');
  const [editingCardDetails, setEditingCardDetails] = useState(null);

  // Delete Confirmation Modal states
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  // Effect to load columns data from localStorage on component mount (client-side only)
  useEffect(() => {
    try {
      const savedColumns = localStorage.getItem('kanbanColumns');
      if (savedColumns) {
        setColumns(JSON.parse(savedColumns));
      }
    } catch (error) {
      console.error("Failed to load columns from localStorage:", error);
    }
  }, []);

  // Effect to save columns data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('kanbanColumns', JSON.stringify(columns));
    } catch (error) {
      console.error("Failed to save columns to localStorage:", error);
    }
  }, [columns]);

  // Effect to load theme index from localStorage on component mount (client-side only)
  useEffect(() => {
    try {
      const savedThemeIndex = localStorage.getItem('kanbanThemeIndex');
      if (savedThemeIndex !== null) {
        setCurrentBgThemeIndex(parseInt(savedThemeIndex, 10));
      }
    } catch (error) {
      console.error("Failed to load theme index from localStorage:", error);
    }
  }, []);

  // Effect to save theme index to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('kanbanThemeIndex', currentBgThemeIndex.toString());
    } catch (error) {
      console.error("Failed to save theme index to localStorage:", error);
    }
  }, [currentBgThemeIndex]);

  const handleDragStart = (e, taskId, columnId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumnId', columnId);
    setDraggedTaskId(taskId);
    setDraggedFromColumnId(columnId);
    e.dataTransfer.effectAllowed = 'move';
    setOpenColorPickerCard(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredColumnId(columnId);

    const targetElement = e.target.closest('.kanban-task-card');

    if (targetElement && targetElement.dataset.taskId !== draggedTaskId) {
      const taskId = targetElement.dataset.taskId;
      const rect = targetElement.getBoundingClientRect();
      const middleY = rect.top + rect.height / 2;

      if (e.clientY < middleY) {
        setInsertionPoint({ columnId: columnId, taskId: taskId, position: 'before' });
      } else {
        setInsertionPoint({ columnId: columnId, taskId: taskId, position: 'after' });
      }
    } else {
      const columnRect = e.currentTarget.getBoundingClientRect();
      const isOverColumnBottom = e.clientY > (columnRect.bottom - 20);

      if (columns[columnId].tasks.length === 0) {
        setInsertionPoint({ columnId: columnId, taskId: null, position: 'start' });
      } else if (isOverColumnBottom && !targetElement) {
        setInsertionPoint({ columnId: columnId, taskId: null, position: 'end' });
      } else {
        setInsertionPoint(null);
      }
    }
  };

  const handleDragLeave = () => {
    setHoveredColumnId(null);
    setInsertionPoint(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDraggedFromColumnId(null);
    setHoveredColumnId(null);
    setInsertionPoint(null);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');

    setDraggedTaskId(null);
    setDraggedFromColumnId(null);
    setHoveredColumnId(null);
    setInsertionPoint(null);

    if (sourceColumnId === targetColumnId && (!insertionPoint || (insertionPoint.columnId === sourceColumnId && insertionPoint.taskId === taskId))) {
        return;
    }

    const newColumns = { ...columns };
    const sourceColumn = newColumns[sourceColumnId];
    const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    const [taskToMove] = sourceColumn.tasks.splice(taskIndex, 1);

    const targetColumn = newColumns[targetColumnId];
    if (insertionPoint && insertionPoint.columnId === targetColumnId) {
      if (insertionPoint.position === 'start') {
        targetColumn.tasks.unshift(taskToMove);
      } else if (insertionPoint.position === 'end') {
        targetColumn.tasks.push(taskToMove);
      } else {
        const targetTaskIndex = targetColumn.tasks.findIndex(
          (task) => task.id === insertionPoint.taskId
        );
        if (targetTaskIndex !== -1) {
          if (insertionPoint.position === 'before') {
            targetColumn.tasks.splice(targetTaskIndex, 0, taskToMove);
          } else {
            targetColumn.tasks.splice(targetTaskIndex + 1, 0, taskToMove);
          }
        } else {
          targetColumn.tasks.push(taskToMove);
        }
      }
    } else {
      targetColumn.tasks.push(taskToMove);
    }

    setColumns(newColumns);
  };

  const handleCycleBgTheme = () => {
    setCurrentBgThemeIndex((prevIndex) =>
      (prevIndex + 1) % backgroundThemes.length
    );
  };

  const toggleColorPicker = (columnId, taskId) => {
    setOpenColorPickerCard(
      openColorPickerCard?.columnId === columnId && openColorPickerCard?.taskId === taskId
        ? null
        : { columnId, taskId }
    );
  };

  const handleCardColorChange = (columnId, taskId, newColorClass) => {
    setColumns(prevColumns => {
      const newCols = { ...prevColumns };
      const column = newCols[columnId];
      const taskIndex = column.tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        column.tasks[taskIndex] = { ...column.tasks[taskIndex], color: newColorClass };
      }
      return newCols;
    });
    setOpenColorPickerCard(null);
  };

  const handleAddCardClick = (columnId) => {
    setAddCardColumnTarget(columnId);
    setNewCardContent('');
    setShowAddCardModal(true);
  };

  const handleSaveNewCard = (content) => {
    setColumns(prevColumns => {
      const newCols = { ...prevColumns };
      const column = newCols[addCardColumnTarget];
      const newId = generateUniqueId();
      column.tasks.push({ id: newId, content: content, color: pastelColors[0].bg });
      return newCols;
    });
    setShowAddCardModal(false);
    setNewCardContent('');
    setAddCardColumnTarget(null);
  };

  const handleEditCardClick = (columnId, task) => {
    setEditingCardDetails({ columnId, taskId: task.id });
    setEditingCardContent(task.content);
    setShowEditCardModal(true);
  };

  const handleSaveEditedCard = (content) => {
    setColumns(prevColumns => {
      const newCols = { ...prevColumns };
      const column = newCols[editingCardDetails.columnId];
      const taskIndex = column.tasks.findIndex(t => t.id === editingCardDetails.taskId);
      if (taskIndex !== -1) {
        column.tasks[taskIndex] = { ...column.tasks[taskIndex], content: content };
      }
      return newCols;
    });
    setShowEditCardModal(false);
    setEditingCardContent('');
    setEditingCardDetails(null);
  };

  const handleDeleteCardClick = (columnId, taskId) => {
    setCardToDelete({ columnId, taskId });
    setShowConfirmDeleteModal(true);
  };

  const confirmDeleteCard = () => {
    if (cardToDelete) {
      setColumns(prevColumns => {
        const newCols = { ...prevColumns };
        newCols[cardToDelete.columnId].tasks = newCols[cardToDelete.columnId].tasks.filter(
          task => task.id !== cardToDelete.taskId
        );
        return newCols;
      });
    }
    setShowConfirmDeleteModal(false);
    setCardToDelete(null);
  };

  const cancelDeleteCard = () => {
    setShowConfirmDeleteModal(false);
    setCardToDelete(null);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundThemes[currentBgThemeIndex].class} p-8 font-sans antialiased relative`}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
        `}
      </style>
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 drop-shadow-sm">
        My Kanban Board
      </h1>

      {/* Single Theme Switch Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleCycleBgTheme}
          className="p-3 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg transition-all duration-200 flex items-center justify-center text-gray-700 hover:text-blue-600"
          title="Switch Theme"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.485l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM3 11a1 1 0 100-2H2a1 1 0 000 2h1z"/>
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-start md:space-x-6 space-y-6 md:space-y-0">
        {Object.entries(columns).map(([columnId, column]) => (
          <KanbanColumn
            key={columnId}
            columnId={columnId}
            column={column}
            draggedTaskId={draggedTaskId}
            hoveredColumnId={hoveredColumnId}
            insertionPoint={insertionPoint}
            openColorPickerCard={openColorPickerCard}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleDragEnd={handleDragEnd}
            handleDragStart={handleDragStart}
            toggleColorPicker={toggleColorPicker}
            handleCardColorChange={handleCardColorChange}
            handleEditCardClick={handleEditCardClick}
            handleDeleteCardClick={handleDeleteCardClick}
            handleAddCardClick={handleAddCardClick}
            pastelColors={pastelColors} // Pass pastelColors to KanbanColumn
          />
        ))}
      </div>

      <AddCardModal
        showAddCardModal={showAddCardModal}
        setShowAddCardModal={setShowAddCardModal}
        newCardContent={newCardContent}
        setNewCardContent={setNewCardContent}
        handleSaveNewCard={handleSaveNewCard}
      />

      <EditCardModal
        showEditCardModal={showEditCardModal}
        setShowEditCardModal={setShowEditCardModal}
        editingCardContent={editingCardContent}
        setEditingCardContent={setEditingCardContent}
        handleSaveEditedCard={handleSaveEditedCard}
      />

      <ConfirmDeleteModal
        showConfirmDeleteModal={showConfirmDeleteModal}
        cancelDeleteCard={cancelDeleteCard}
        confirmDeleteCard={confirmDeleteCard}
      />
    </div>
  );
};

export default KanbanBoard;
