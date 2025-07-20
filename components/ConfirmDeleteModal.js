import React from 'react';

const ConfirmDeleteModal = ({ showConfirmDeleteModal, cancelDeleteCard, confirmDeleteCard }) => {
  if (!showConfirmDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="text-gray-700 mb-6">Are you sure you want to delete this task?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={cancelDeleteCard}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteCard}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
