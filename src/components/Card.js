import React from 'react'

function Card({children}) {
  return (
   

        <div className='w-[100vw] sm:h-[calc(100vh-1rem)] bg-[#748d92] rounded-lg overflow-hidden flex flex-col font-sans text-white]'>
            {children}
        </div>
      
    
  )
}

export default Card
