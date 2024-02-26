import React from 'react'

export default function Timer({time}) {
    return (
        <div className='absolute w-full h-[calc(100vh-95px)] flex justify-center items-center box-border z-10' style={{backgroundColor: "rgba(0, 0, 0, 0.75)"}}>
            <span className='text-white font-medium text-8xl'>{time}</span>
        </div>
    )
}