
CREATE TABLE accounts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(60) NOT NULL,
    bio VARCHAR(1023),
	CONSTRAINT usernameUnique UNIQUE (username)
);

CREATE TABLE challenges (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    challengeText VARCHAR(2047),
    solutionText VARCHAR(2047),
    progLanguage VARCHAR(127),
    difficulty VARCHAR(127),
    description VARCHAR(1023),
    datePublished DATE,
    numOfPlays INT,
    accountUsername VARCHAR(50) NOT NULL,
    FOREIGN KEY(accountUsername) REFERENCES accounts(username)
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commentText VARCHAR(255),
    accountUsername VARCHAR(50) NOT NULL,
    challengeId INT UNSIGNED NOT NULL,
    FOREIGN KEY(challengeId) REFERENCES challenges(id) ON DELETE CASCADE,
    FOREIGN KEY(accountUsername) REFERENCES accounts(username)
);

