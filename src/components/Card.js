import React from 'react'

function Card({children}) {
  return (
    <div className='h-min-screen bg-gray-200 flex items-center justify-center p-4 font-sans'>

        <div className='w-[100vw] h-[calc(100vh-2.2rem) bg-white rounded-lg overflow-hidden flex flex-col shadow-lg font-sans]'>
            {children}
        </div>
      
    </div>
  )
}

export default Card
