CREATE TABLE challenges (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    challengeText VARCHAR(255),
    solutionText VARCHAR(255),
    progLanguage VARCHAR(127),
    difficulty VARCHAR(127),
    description VARCHAR(255),
    datePublished DATE,
    numOfPlays INT,
    userId INT
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commentText VARCHAR(255),
    userId INT,
    challengeId INT UNSIGNED,
    FOREIGN KEY(challengeId) REFERENCES challenges(id)
);

-- Create a table to store user accounts in.
CREATE TABLE accounts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(30) NOT NULL,
	CONSTRAINT usernameUnique UNIQUE (username)
);

-- Create a dummy account for testing.
INSERT INTO accounts (username, password) VALUES ("Alice", "abc123");

-- Inserting dummy challenge for testing
INSERT INTO challenges (title, challengeText, solutionText, progLanguage, difficulty, description, datePublished, numOfPlays, userId) VALUES ("DB title", "DB challengeText", "DB solutionText", "DB progLanguage", "DB difficulty", "DB description", "2022-02-03", 1337, 420);
INSERT INTO challenges (title, challengeText, solutionText, progLanguage, difficulty, description, datePublished, numOfPlays, userId) VALUES ("DB title2", "DB challengeText2", "DB solutionText2", "DB progLanguage2", "DB difficulty2", "DB description2", "2022-02-04", 1338, 421);

