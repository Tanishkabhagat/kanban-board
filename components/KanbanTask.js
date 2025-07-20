import React from 'react';

const KanbanTask = ({
  task,
  columnId,
  draggedTaskId,
  openColorPickerCard,
  handleDragStart,
  toggleColorPicker,
  handleCardColorChange,
  handleEditCardClick,
  handleDeleteCardClick,
  pastelColors,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task.id, columnId)}
      onClick={(e) => {
        e.stopPropagation();
        toggleColorPicker(columnId, task.id);
      }}
      className={`
        kanban-task-card
        ${task.color}
        p-4 rounded-lg shadow-sm cursor-grab
        border border-gray-100 transition-all duration-200
        hover:shadow-md relative group
        ${draggedTaskId === task.id ? 'opacity-50 border-dashed border-blue-400' : ''}
      `}
      data-task-id={task.id}
    >
      <p className="text-gray-800 text-sm font-medium mb-2">{task.content}</p>

      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10
                      ${openColorPickerCard?.columnId === columnId && openColorPickerCard?.taskId === task.id ? 'opacity-100' : ''}">
        <button
          onClick={(e) => { e.stopPropagation(); handleEditCardClick(columnId, task); }}
          className="p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 shadow-sm text-gray-600 hover:text-blue-600"
          title="Edit task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.828z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleDeleteCardClick(columnId, task.id); }}
          className="p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 shadow-sm text-gray-600 hover:text-red-600"
          title="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {openColorPickerCard?.columnId === columnId && openColorPickerCard?.taskId === task.id && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-2 flex space-x-1 z-20 border border-gray-200">
          {pastelColors.map((color) => (
            <button
              key={color.name}
              onClick={(e) => {
                e.stopPropagation();
                handleCardColorChange(columnId, task.id, color.bg);
              }}
              className={`w-6 h-6 rounded-full border ${color.border} ${color.bg} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}
              title={color.name}
            >
              {task.color === color.bg && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanTask;
