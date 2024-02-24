import React from 'react'

export default function GameAnswer({ answer, onAnswerSelected }) {
    const handleClick = () => {
        onAnswerSelected(answer);
    };    
    return (
        <div className='bg-blue-400 flex justify-center items-center w-full h-24 rounded-md text-white text-center font-normal text-lg cursor-pointer transform transition duration-500 hover:scale-105' onClick={handleClick} >
            {answer.name}
        </div>
    )
}
