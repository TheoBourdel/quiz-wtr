import React from 'react';
import { Button } from 'flowbite-react';

const BackButton = () => {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <Button onClick={handleGoBack}>Retour</Button>
    );
};

export default BackButton;
