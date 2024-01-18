import React from 'react';
import { useParams } from 'react-router-dom';

function Quiz() {
    const { link } = useParams();

    // Vous pouvez maintenant utiliser la variable 'link' pour récupérer des données ou pour d'autres logiques
    console.log(link);

    return (
        <div>
            <h1>Quiz</h1>
            <p>Link: {link}</p>
        </div>
    );
}

export default Quiz;
