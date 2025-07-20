import React from 'react';

/**
 * A simple modal component for adding a new card.
 *
 * @param {object} props - The component's props.
 * @param {boolean} props.showAddCardModal - Controls the visibility of the modal.
 * @param {function} props.setShowAddCardModal - Function to update the modal's visibility.
 * @param {string} props.newCardContent - The content for the new card.
 * @param {function} props.setNewCardContent - Function to update the new card's content.
 * @param {function} props.handleSaveNewCard - The function to call when saving the new card.
 */
const AddCardModal = ({
  showAddCardModal,
  setShowAddCardModal,
  newCardContent,
  setNewCardContent,
  handleSaveNewCard,
}) => {
  // If the modal is not supposed to be shown, render nothing.
  if (!showAddCardModal) {
    return null;
  }

  // Function to handle the save action.
  const onSave = () => {
    const trimmedContent = newCardContent.trim();
    // Only save if there is actual content.
    if (trimmedContent) {
      handleSaveNewCard(trimmedContent);
      // Reset and close the modal after saving.
      setNewCardContent('');
      setShowAddCardModal(false);
    }
  };

  // Function to handle the cancel action.
  const onCancel = () => {
    // Reset and close the modal without saving.
    setNewCardContent('');
    setShowAddCardModal(false);
  };

  const isSaveDisabled = newCardContent.trim() === '';

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 p-4">
      {/* Modal content container */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Card</h2>
        {/* Text area for user input */}
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="4"
          placeholder="Enter task content..."
          value={newCardContent}
          onChange={(e) => setNewCardContent(e.target.value)}
          aria-label="New card content"
        />
        {/* Action buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaveDisabled}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md transition-colors ${
              isSaveDisabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;
