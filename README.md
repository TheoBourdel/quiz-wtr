# WTR QUIZ


## Prérequis
Avant de commencer, assurez-vous d'avoir installé :

Docker et Docker Compose
Node.js
Un système de gestion de base de données (si nécessaire)
Installation
Suivez ces étapes pour configurer votre environnement de développement.

## Cloner le projet


`Pour cloner le projet sur votre machine locale, exécutez :`

    git clone https://github.com/TheoBourdel/quiz-wtr.git

    cd quiz-wtr

-----------------

### Démarrer les services avec Docker

`Positionnez-vous à la racine du projet et lancez :`

    docker-compose up -d

#### Cela démarrera tous la base de donnees en arrière-plan.


-----------------
### Initialiser la base de données

### Exécutez le script SQL sql.sql qui se trouve dans le dossier server pour initialiser votre base de données .

`Creer la base de données`

    cd quiz-wtr/server
    docker cp ./sql.sql <nom du conteneur>:/sql.sql
    docker exec -i <nom du conteneur> psql -U root -d db -a -f /sql.sql


-----------------

`Installer les dépendances et démarrer le serveur`

    cd server
    npm install
    npm start

### Cela installera toutes les dépendances nécessaires et démarrera le serveur backend.
-----------------
## Installer les dépendances et démarrer le client

`Ouvrez un nouveau terminal, puis :`

    cd client
    npm install
    npm start

### Cela lancera l'application client sur votre navigateur par défaut.
