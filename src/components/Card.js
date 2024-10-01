import React from 'react'

function Card({children}) {
  return (
   

        <div className='w-[100vw] bg-[#181c2c] rounded-lg overflow-hidden flex flex-col font-sans text-white]'>
            {children}
        </div>
      
    
  )
}

export default Card
