import React from 'react';

function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-8 h-8 border-4 border-blue-500 mt-10 border-t-transparent border-solid rounded-full animate-spin mb-8"></div>
    </div>
  );
}

export default Spinner;
