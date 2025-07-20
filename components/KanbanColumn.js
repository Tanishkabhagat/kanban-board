import React from 'react';
import KanbanTask from './KanbanTask';

const KanbanColumn = ({
  columnId,
  column,
  draggedTaskId,
  hoveredColumnId,
  insertionPoint,
  openColorPickerCard,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDragEnd,
  handleDragStart,
  toggleColorPicker,
  handleCardColorChange,
  handleEditCardClick,
  handleDeleteCardClick,
  handleAddCardClick,
  pastelColors,
}) => {
  return (
    <div
      onDragOver={(e) => handleDragOver(e, columnId)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, columnId)}
      onDragEnd={handleDragEnd}
      className={`
        w-full md:w-80 bg-white bg-opacity-90 rounded-xl shadow-lg p-5 border
        transition-all duration-300 hover:shadow-xl
        ${hoveredColumnId === columnId && !insertionPoint ? 'border-dashed border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'}
      `}
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
        {column.name} ({column.tasks.length})
      </h2>
      <div className="space-y-3 min-h-[50px] relative">
        {insertionPoint && insertionPoint.columnId === columnId && insertionPoint.position === 'start' && (
          <div className="h-1 bg-blue-500 rounded-full my-1 animate-pulse"></div>
        )}

        {column.tasks.length === 0 && (
          <p className="text-gray-500 text-sm italic text-center py-4">
            No tasks here. Drag one!
          </p>
        )}
        {column.tasks.map((task) => (
          <React.Fragment key={task.id}>
            {insertionPoint &&
              insertionPoint.columnId === columnId &&
              insertionPoint.taskId === task.id &&
              insertionPoint.position === 'before' && (
                <div className="h-1 bg-blue-500 rounded-full my-1 animate-pulse"></div>
              )}
            <KanbanTask
              task={task}
              columnId={columnId}
              draggedTaskId={draggedTaskId}
              openColorPickerCard={openColorPickerCard}
              handleDragStart={handleDragStart}
              toggleColorPicker={toggleColorPicker}
              handleCardColorChange={handleCardColorChange}
              handleEditCardClick={handleEditCardClick}
              handleDeleteCardClick={handleDeleteCardClick}
              pastelColors={pastelColors}
            />
            {insertionPoint &&
              insertionPoint.columnId === columnId &&
              insertionPoint.taskId === task.id &&
              insertionPoint.position === 'after' && (
                <div className="h-1 bg-blue-500 rounded-full my-1 animate-pulse"></div>
              )}
          </React.Fragment>
        ))}
        {insertionPoint &&
          insertionPoint.columnId === columnId &&
          column.tasks.length > 0 &&
          insertionPoint.taskId === null &&
          insertionPoint.position === 'end' && (
            <div className="h-1 bg-blue-500 rounded-full my-1 animate-pulse"></div>
        )}
      </div>
      <button
        onClick={() => handleAddCardClick(columnId)}
        className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span>Add Card</span>
      </button>
    </div>
  );
};

export default KanbanColumn;
