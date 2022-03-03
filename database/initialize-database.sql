
-- Create a table to store user accounts in.
CREATE TABLE accounts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(60) NOT NULL,
    bio VARCHAR(400),
	CONSTRAINT usernameUnique UNIQUE (username)
);

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
    accountUsername VARCHAR(50) NOT NULL,
    FOREIGN KEY(accountUsername) REFERENCES accounts(username)
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commentText VARCHAR(255),
    accountUsername VARCHAR(50) NOT NULL,
    challengeId INT UNSIGNED,
    FOREIGN KEY(challengeId) REFERENCES challenges(id) ON DELETE CASCADE,
    FOREIGN KEY(accountUsername) REFERENCES accounts(username)
);

-- Create a dummy account for testing.
-- INSERT INTO accounts (username, password) VALUES ("Alice", "abc123");

-- Inserting dummy values for testing
INSERT INTO accounts (username, password, bio) VALUES ("Joel", "12345", "hej");
INSERT INTO accounts (username, password, bio) VALUES ("Mattias", "12345", "hej2");

INSERT INTO challenges (title, challengeText, solutionText, progLanguage, difficulty, description, datePublished, numOfPlays, accountUsername) VALUES ("DB title", "DB challengeText", "DB solutionText", "DB progLanguage", "DB difficulty", "DB description", "2022-02-03", 1337, "Joel");
INSERT INTO challenges (title, challengeText, solutionText, progLanguage, difficulty, description, datePublished, numOfPlays, accountUsername) VALUES ("Test functionality", "Hello this is som random text that [[INSERT_CODE_HERE]] :)", "[[works great!]]", "DB progLanguage2", "DB difficulty2", "DB description2", "2022-02-04", 1338, "Mattias");

INSERT INTO comments (commentText, accountUsername, challengeId) VALUES ("Test comment content", "Joel", 1);
INSERT INTO comments (commentText, accountUsername, challengeId) VALUES ("Test comment content... again", "Mattias", 1);

