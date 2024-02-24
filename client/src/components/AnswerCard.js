import React from 'react'
import { Button } from 'flowbite-react';

export default function AnswerCard({answer, deleteAnswer, updateAnswer}) {
    const borderColor = answer.is_correct ? 'border-green-200' : 'border-red-200';
    const shadowColor = answer.is_correct ? 'shadow-green-300' : 'shadow-red-300';
    const backgroundColor = answer.is_correct ? 'bg-green-100' : 'bg-red-100';

    return (
        <div className={`cursor-pointer flex rounded-lg border ${borderColor} ${backgroundColor} ${shadowColor} shadow-md dark:border-gray-700 dark:bg-gray-800 flex-row h-full w-[600px] justify-between gap-4 p-6 items-center`}>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {answer.name}
            </h5>
            <div className="flex flex-row">
                <Button className="mr-2" onClick={() => updateAnswer()}>Modifier</Button>
                <Button color='failure' className="mr-2" onClick={() => deleteAnswer()}>Supprimer</Button>
            </div>
        </div>
    )
}
