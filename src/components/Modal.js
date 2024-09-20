import React from 'react';

function Modal({ isOpen, toggleModal }) {

    console.log("ISPOEN",isOpen)
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3">
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
          <p className="text-gray-600 mb-4">
            This is a modal popup in Tailwind CSS.
          </p>
          {/* Close button */}
          <button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded"
            onClick={toggleModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
