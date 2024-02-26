'use client';
import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

export default function Question({ question, deleteQuestion, quizId, updateQuestion }) {
    return (
        <div className="cursor-pointer flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-row h-full w-full justify-between gap-4 p-6 items-center">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {question.name}
            </h5>
            <div className="flex flex-row">
                <Button color="gray" className="mr-2">
                    <Link to={"/admin/quiz/" + quizId + '/question/' + question.id}>Gérer les réponses</Link>
                </Button>
                <Button className="mr-2" onClick={() => updateQuestion()}>Modifier</Button>
                <Button color='failure' className="mr-2" onClick={() => deleteQuestion()}>Supprimer</Button>
            </div>
        </div>
    )
}
