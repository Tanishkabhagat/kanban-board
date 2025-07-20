import React, { useState, useEffect } from 'react';

const EditCardModal = ({ showEditCardModal, setShowEditCardModal, editingCardContent, setEditingCardContent, handleSaveEditedCard }) => {
  // Local state for the input field, initialized from prop
  const [localContent, setLocalContent] = useState(editingCardContent);

  // Update local content when prop changes (e.g., a different card is selected)
  useEffect(() => {
    setLocalContent(editingCardContent);
  }, [editingCardContent]);

  const onSave = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event propagation
    if (localContent.trim() === '') return;
    handleSaveEditedCard(localContent);
  };

  if (!showEditCardModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Card</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          placeholder="Edit task content..."
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowEditCardModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCardModal;
