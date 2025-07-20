import React, { useState, useEffect } from 'react';

// --- Data & Configuration ---

// Defines the color palette for cards. Each object includes classes for light and dark modes.
const pastelColors = [
  { name: 'Blue', bg: 'bg-blue-100', darkBg: 'dark:bg-blue-900/50' },
  { name: 'Green', bg: 'bg-green-100', darkBg: 'dark:bg-green-900/50' },
  { name: 'Pink', bg: 'bg-pink-100', darkBg: 'dark:bg-pink-900/50' },
  { name: 'Yellow', bg: 'bg-yellow-100', darkBg: 'dark:bg-yellow-900/50' },
  { name: 'Purple', bg: 'bg-purple-100', darkBg: 'dark:bg-purple-900/50' },
  { name: 'Gray', bg: 'bg-gray-200', darkBg: 'dark:bg-gray-700' },
];

// Defines the available background gradient themes for both light and dark modes.
const backgroundThemes = [
  { name: 'Blue-Purple', class: 'from-blue-100 to-purple-200', darkClass: 'dark:from-gray-900 dark:to-blue-900/50' },
  { name: 'Green-Yellow', class: 'from-green-100 to-yellow-200', darkClass: 'dark:from-gray-900 dark:to-green-900/50' },
  { name: 'Pink-Orange', class: 'from-pink-100 to-orange-200', darkClass: 'dark:from-gray-900 dark:to-pink-900/50' },
  { name: 'Gray-Blue', class: 'from-gray-100 to-blue-200', darkClass: 'dark:from-gray-900 dark:to-gray-800' },
];

// Sets the initial state of the board if no data is found in localStorage.
// Tasks now store a `colorIndex` to easily look up colors from the `pastelColors` array.
const defaultColumns = {
  'todo': {
    name: 'To Do',
    tasks: [
      { id: 'task-1', content: 'Set up Next.js project', colorIndex: 0 },
      { id: 'task-2', content: 'Design basic UI layout', colorIndex: 1 },
    ],
  },
  'in-progress': {
    name: 'In Progress',
    tasks: [
      { id: 'task-3', content: 'Implement drag-and-drop functionality', colorIndex: 3 },
    ],
  },
  'done': {
    name: 'Done',
    tasks: [
      { id: 'task-4', content: 'Plan Kanban board features', colorIndex: 4 },
    ],
  },
};

// --- SVG Icon Components ---
// These are simple, reusable components for icons to keep the main layout clean.

const PaletteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 2v1h3V4H5zm0 2v1h3V6H5zm0 2v1h3V8H5zm0 2v1h3v-1H5zM15 2a1 1 0 011 1v1.586l-2.707 2.707a1 1 0 01-1.414-1.414L14.586 3H13a1 1 0 110-2h2zm-3 6a1 1 0 011.414 0l4.243 4.243a1 1 0 11-1.414 1.414L12 9.414l-4.243 4.243a1 1 0 11-1.414-1.414L10.586 8H12z" clipRule="evenodd" /></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
);
const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
);
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.485l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM3 11a1 1 0 100-2H2a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
);
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
);

// --- Reusable UI Components ---

/**
 * A visual indicator for where a dragged card will be dropped.
 */
const DropIndicator = () => <div className="my-1 h-1.5 w-full bg-blue-500 rounded-full" />;

/**
 * A pop-up color picker for changing a card's color.
 * @param {function} onColorSelect - Callback function that returns the selected color index.
 * @param {Array} colors - The array of available color objects.
 */
const ColorPicker = ({ onColorSelect, colors }) => (
    <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-20 flex space-x-1">
        {colors.map((color, index) => (
            <button
                key={color.name}
                onClick={() => onColorSelect(index)}
                className={`w-6 h-6 rounded-full ${color.bg} ${color.darkBg} border-2 border-white/50 hover:border-gray-400 dark:hover:border-gray-300`}
                title={color.name}
            />
        ))}
    </div>
);

/**
 * Represents a single draggable card on the board.
 */
const KanbanCard = ({ task, columnId, handleDragStart, handleEditCardClick, handleDeleteCardClick, toggleColorPicker, openColorPickerCard, handleCardColorChange }) => {
    // Look up the full color object using the index to get both light and dark mode classes.
    const color = pastelColors[task.colorIndex] || pastelColors[5]; // Fallback to gray if index is invalid.
    return (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, task.id, columnId)}
            className={`p-3 mb-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing relative ${color.bg} ${color.darkBg}`}
            data-task-id={task.id}
        >
            <p className="text-sm text-gray-800 dark:text-gray-200 break-words">{task.content}</p>
            <div className="flex justify-end items-center mt-2 space-x-3">
                <button onClick={() => toggleColorPicker(columnId, task.id)} className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Change Color"><PaletteIcon /></button>
                <button onClick={() => handleEditCardClick(columnId, task)} className="text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors" title="Edit Card"><EditIcon /></button>
                <button onClick={() => handleDeleteCardClick(columnId, task.id)} className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete Card"><DeleteIcon /></button>
            </div>
            {openColorPickerCard?.columnId === columnId && openColorPickerCard?.taskId === task.id && (
                <ColorPicker
                    colors={pastelColors}
                    onColorSelect={(newColorIndex) => handleCardColorChange(columnId, task.id, newColorIndex)}
                />
            )}
        </div>
    );
};

/**
 * Represents a single column on the board (e.g., "To Do", "In Progress").
 */
const KanbanColumn = ({ columnId, column, insertionPoint, handleDragOver, handleDrop, handleDragLeave, handleDragStart, handleAddCardClick, handleEditCardClick, handleDeleteCardClick, toggleColorPicker, openColorPickerCard, handleCardColorChange }) => (
    <div
        onDragOver={(e) => handleDragOver(e, columnId)}
        onDrop={(e) => handleDrop(e, columnId)}
        onDragLeave={handleDragLeave}
        className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 w-full md:w-80 flex-shrink-0 transition-colors"
    >
        <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-4">{column.name}</h3>
        <div className="min-h-[200px]">
            {column.tasks.map(task => {
                const showIndicatorBefore = insertionPoint?.columnId === columnId && insertionPoint?.taskId === task.id && insertionPoint?.position === 'before';
                const showIndicatorAfter = insertionPoint?.columnId === columnId && insertionPoint?.taskId === task.id && insertionPoint?.position === 'after';
                return (
                    <React.Fragment key={task.id}>
                       {showIndicatorBefore && <DropIndicator />}
                       <KanbanCard
                           task={task}
                           columnId={columnId}
                           handleDragStart={handleDragStart}
                           handleEditCardClick={handleEditCardClick}
                           handleDeleteCardClick={handleDeleteCardClick}
                           toggleColorPicker={toggleColorPicker}
                           openColorPickerCard={openColorPickerCard}
                           handleCardColorChange={handleCardColorChange}
                       />
                       {showIndicatorAfter && <DropIndicator />}
                    </React.Fragment>
                )
            })}
             {insertionPoint?.columnId === columnId && (insertionPoint?.position === 'start' || insertionPoint?.position === 'end') && <DropIndicator />}
        </div>
        <button
            onClick={() => handleAddCardClick(columnId)}
            className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
            + Add Card
        </button>
    </div>
);

/**
 * A generic, reusable Modal component.
 * @param {boolean} show - Controls visibility.
 * @param {function} onClose - Function to call when the modal should be closed.
 * @param {React.ReactNode} children - The content to display inside the modal.
 */
const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

// The following are specific implementations of the generic Modal for different actions.

const AddCardModal = ({ show, onClose, onSave, content, setContent }) => (
    <Modal show={show} onClose={onClose}>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Add New Card</h2>
        <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md mb-4"
            rows="4"
            placeholder="Enter task content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button onClick={() => onSave(content)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Card</button>
        </div>
    </Modal>
);

const EditCardModal = ({ show, onClose, onSave, content, setContent }) => (
     <Modal show={show} onClose={onClose}>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Edit Card</h2>
        <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md mb-4"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button onClick={() => onSave(content)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Save Changes</button>
        </div>
    </Modal>
);

const ConfirmDeleteModal = ({ show, onClose, onConfirm }) => (
    <Modal show={show} onClose={onClose}>
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Are you sure?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
        </div>
    </Modal>
);

/**
 * Generates a simple, unique ID for new cards.
 */
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};


/**
 * The main component for the Kanban Board application.
 * Manages all state and logic for the board.
 */
const KanbanBoard = () => {
  // State for the board's columns and tasks.
  const [columns, setColumns] = useState(defaultColumns);
  // State for drag-and-drop functionality.
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [insertionPoint, setInsertionPoint] = useState(null);
  // State for visual themes.
  const [currentBgThemeIndex, setCurrentBgThemeIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // State for the color picker pop-up.
  const [openColorPickerCard, setOpenColorPickerCard] = useState(null);

  // States for managing modals.
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardContent, setNewCardContent] = useState('');
  const [addCardColumnTarget, setAddCardColumnTarget] = useState(null);
  
  const [showEditCardModal, setShowEditCardModal] = useState(false);
  const [editingCardContent, setEditingCardContent] = useState('');
  const [editingCardDetails, setEditingCardDetails] = useState(null);

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);


  // --- Side Effects (useEffect) ---

  // On initial component mount, load all data from localStorage.
  useEffect(() => {
    try {
      let columnsData = defaultColumns;
      const savedColumnsJSON = localStorage.getItem('kanbanColumns');

      if (savedColumnsJSON) {
        let savedColumns = JSON.parse(savedColumnsJSON);
        
        // --- DATA MIGRATION ---
        // This block checks if the data stored in localStorage uses the old format
        // (with a `color` string) and converts it to the new format (with `colorIndex`).
        // This ensures dark mode works for users with older saved data.
        const firstColumnKey = Object.keys(savedColumns)[0];
        if (firstColumnKey && savedColumns[firstColumnKey].tasks.length > 0 && savedColumns[firstColumnKey].tasks[0].hasOwnProperty('color')) {
          const migratedColumns = JSON.parse(JSON.stringify(savedColumns));
          for (const columnId in migratedColumns) {
            migratedColumns[columnId].tasks = migratedColumns[columnId].tasks.map(task => {
              if (task.hasOwnProperty('color') && !task.hasOwnProperty('colorIndex')) {
                const colorIndex = pastelColors.findIndex(p => p.bg === task.color);
                return { id: task.id, content: task.content, colorIndex: colorIndex !== -1 ? colorIndex : 5 };
              }
              return task;
            });
          }
          savedColumns = migratedColumns;
        }
        columnsData = savedColumns;
      }
      setColumns(columnsData);

      const savedThemeIndex = localStorage.getItem('kanbanThemeIndex');
      if (savedThemeIndex !== null) setCurrentBgThemeIndex(parseInt(savedThemeIndex, 10));
      
      const savedDarkMode = localStorage.getItem('kanbanDarkMode');
      if (savedDarkMode !== null) setIsDarkMode(JSON.parse(savedDarkMode));

    } catch (error) {
      console.error("Failed to load or migrate from localStorage:", error);
      setColumns(defaultColumns); // Fallback to default if there's an error.
    }
  }, []); // Empty dependency array means this runs only once on mount.

  // Whenever the 'columns' state changes, save it to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem('kanbanColumns', JSON.stringify(columns));
    } catch (error) {
      console.error("Failed to save columns to localStorage:", error);
    }
  }, [columns]);

  // Whenever the 'currentBgThemeIndex' state changes, save it to localStorage.
  useEffect(() => {
    try {
        localStorage.setItem('kanbanThemeIndex', currentBgThemeIndex.toString());
    } catch (error) {
        console.error("Failed to save theme index to localStorage:", error);
    }
  }, [currentBgThemeIndex]);
  
  // Whenever 'isDarkMode' state changes, save it and toggle the 'dark' class on the root HTML element.
  useEffect(() => {
    try {
        localStorage.setItem('kanbanDarkMode', JSON.stringify(isDarkMode));
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } catch (error) {
        console.error("Failed to save dark mode to localStorage:", error);
    }
  }, [isDarkMode]);

  // --- Event Handlers ---

  const handleDragStart = (e, taskId, columnId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumnId', columnId);
    setDraggedTaskId(taskId);
    setOpenColorPickerCard(null); // Close color picker when dragging starts.
  };
  
  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    const targetCard = e.target.closest('[data-task-id]');
    if (targetCard && targetCard.dataset.taskId !== draggedTaskId) {
        const taskId = targetCard.dataset.taskId;
        const rect = targetCard.getBoundingClientRect();
        const middleY = rect.top + rect.height / 2;
        const position = e.clientY < middleY ? 'before' : 'after';
        setInsertionPoint({ columnId, taskId, position });
    } else if (!targetCard) {
        if (columns[columnId].tasks.length === 0) {
            setInsertionPoint({ columnId, taskId: null, position: 'start' });
        } else {
            setInsertionPoint({ columnId, taskId: null, position: 'end' });
        }
    }
  };

  const handleDragLeave = () => {
      setInsertionPoint(null);
  };
  
  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setInsertionPoint(null);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');

    if (!taskId || !sourceColumnId || !insertionPoint) {
        handleDragEnd();
        return;
    }

    const newColumns = JSON.parse(JSON.stringify(columns));
    const sourceColumn = newColumns[sourceColumnId];
    const targetColumn = newColumns[targetColumnId];
    
    const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        handleDragEnd();
        return;
    }
    
    const [taskToMove] = sourceColumn.tasks.splice(taskIndex, 1);

    if (insertionPoint.position === 'start') {
        targetColumn.tasks.unshift(taskToMove);
    } else if (insertionPoint.position === 'end') {
        targetColumn.tasks.push(taskToMove);
    } else {
        const targetTaskIndex = targetColumn.tasks.findIndex(
            (task) => task.id === insertionPoint.taskId
        );
        if (targetTaskIndex !== -1) {
            const insertIndex = insertionPoint.position === 'before' ? targetTaskIndex : targetTaskIndex + 1;
            targetColumn.tasks.splice(insertIndex, 0, taskToMove);
        } else {
            targetColumn.tasks.push(taskToMove);
        }
    }

    setColumns(newColumns);
    handleDragEnd();
  };
  
  const handleCycleBgTheme = () => {
    setCurrentBgThemeIndex((prevIndex) =>
      (prevIndex + 1) % backgroundThemes.length
    );
  };
  
  const handleToggleDarkMode = () => {
      setIsDarkMode(prev => !prev);
  }

  const toggleColorPicker = (columnId, taskId) => {
    setOpenColorPickerCard(
      openColorPickerCard?.columnId === columnId && openColorPickerCard?.taskId === taskId
        ? null
        : { columnId, taskId }
    );
  };

  const handleCardColorChange = (columnId, taskId, newColorIndex) => {
    setColumns(prevColumns => {
      const newCols = { ...prevColumns };
      const column = newCols[columnId];
      const taskIndex = column.tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        // Update the colorIndex of the task
        column.tasks[taskIndex].colorIndex = newColorIndex;
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
    if (!content.trim()) return;
    const newId = generateUniqueId();
    // New cards get the first color (index 0) by default.
    const newCard = { id: newId, content, colorIndex: 0 };
    const newColumns = { ...columns };
    newColumns[addCardColumnTarget].tasks.push(newCard);
    setColumns(newColumns);
    setShowAddCardModal(false);
  };

  const handleEditCardClick = (columnId, task) => {
    setEditingCardDetails({ columnId, taskId: task.id });
    setEditingCardContent(task.content);
    setShowEditCardModal(true);
  };

  const handleSaveEditedCard = (content) => {
    if (!content.trim() || !editingCardDetails) return;
    const { columnId, taskId } = editingCardDetails;
    const newColumns = { ...columns };
    const taskToUpdate = newColumns[columnId].tasks.find(t => t.id === taskId);
    if (taskToUpdate) {
        taskToUpdate.content = content;
        setColumns(newColumns);
    }
    setShowEditCardModal(false);
  };

  const handleDeleteCardClick = (columnId, taskId) => {
    setCardToDelete({ columnId, taskId });
    setShowConfirmDeleteModal(true);
  };
  
  const confirmDeleteCard = () => {
    if (!cardToDelete) return;
    const { columnId, taskId } = cardToDelete;
    const newColumns = { ...columns };
    newColumns[columnId].tasks = newColumns[columnId].tasks.filter(task => task.id !== taskId);
    setColumns(newColumns);
    setShowConfirmDeleteModal(false);
    setCardToDelete(null);
  };

  // --- Render Method ---

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundThemes[currentBgThemeIndex].class} ${backgroundThemes[currentBgThemeIndex].darkClass} p-8 font-sans antialiased relative transition-colors duration-300`}>
        <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
        `}
      </style>
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6 drop-shadow-sm">
        My Kanban Board
      </h1>

      {/* Top-right buttons for theme and dark mode */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <button
          onClick={handleCycleBgTheme}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-opacity-100 dark:hover:bg-gray-700 shadow-lg transition-all duration-200 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          title="Switch Theme"
        >
          <PaletteIcon />
        </button>
      
      </div>

      {/* Main board container */}
      <div className="flex flex-col md:flex-row justify-center items-start md:space-x-6 space-y-6 md:space-y-0">
        {Object.entries(columns).map(([columnId, column]) => (
          <KanbanColumn
            key={columnId}
            columnId={columnId}
            column={column}
            insertionPoint={insertionPoint}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragLeave={handleDragLeave}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleAddCardClick={handleAddCardClick}
            handleEditCardClick={handleEditCardClick}
            handleDeleteCardClick={handleDeleteCardClick}
            toggleColorPicker={toggleColorPicker}
            openColorPickerCard={openColorPickerCard}
            handleCardColorChange={handleCardColorChange}
          />
        ))}
      </div>

      {/* Modals for user actions */}
      <AddCardModal
        show={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onSave={handleSaveNewCard}
        content={newCardContent}
        setContent={setNewCardContent}
      />
      
      <EditCardModal
        show={showEditCardModal}
        onClose={() => setShowEditCardModal(false)}
        onSave={handleSaveEditedCard}
        content={editingCardContent}
        setContent={setEditingCardContent}
      />

      <ConfirmDeleteModal
        show={showConfirmDeleteModal}
        onClose={() => setShowConfirmDeleteModal(false)}
        onConfirm={confirmDeleteCard}
      />
    </div>
  );
};

export default KanbanBoard;
