CREATE TABLE quiz (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE question (
    id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quiz(id),
    name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    refresh_token TEXT
);

CREATE TABLE answer (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    question_id INT REFERENCES question(id)
);

CREATE TABLE room (
    id SERIAL PRIMARY KEY,
    link VARCHAR(255) NOT NULL,
    isPrivate BOOLEAN NOT NULL,
    status VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    nombreDePersonne INT,
    quiz_id INT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id) 
);
-- Ajouter la colonne isRandom (INTEGER)
ALTER TABLE quiz
ADD COLUMN isRandom BOOLEAN;

-- Ajouter la colonne timer (INTEGER)
ALTER TABLE quiz
ADD COLUMN timer INTEGER;
