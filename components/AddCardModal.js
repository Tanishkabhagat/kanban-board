import React, { useRef } from 'react';

const AddCardModal = ({
  showAddCardModal,
  setShowAddCardModal,
  newCardContent,
  setNewCardContent,
  handleSaveNewCard,
}) => {
  const isSubmitting = useRef(false); // prevent duplicate submissions

  const onSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const trimmedContent = newCardContent.trim();
    if (!trimmedContent || isSubmitting.current) return;

    isSubmitting.current = true;

    try {
      await handleSaveNewCard(trimmedContent); // make sure it's async safe
    } finally {
      setNewCardContent('');
      setShowAddCardModal(false);
      isSubmitting.current = false;
    }
  };

  const onCancel = () => {
    setNewCardContent('');
    setShowAddCardModal(false);
    isSubmitting.current = false;
  };

  if (!showAddCardModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Card</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          placeholder="Enter task content..."
          value={newCardContent}
          onChange={(e) => setNewCardContent(e.target.value)}
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSubmitting.current}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md transition-colors ${
              isSubmitting.current
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
          >
            {isSubmitting.current ? 'Adding...' : 'Add Card'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;
