const db = require('./db')


// Challenges
exports.getAllChallenges = function(callback){

    const query = 'SELECT * FROM challenges ORDER BY challengeId ASC'
    const values = []

    db.query(query, values, function(error, challenges){
        if(error){
            callback(['databaseError'], null)
        }
        else{
            callback([], challenges)
        }
    })
}

exports.getChallengeById = function(id, callback){
	
	const query = `SELECT * FROM challenges WHERE id = ? LIMIT 1`
	const values = [id]
	
	db.query(query, values, function(error, challenges){
		if(error){
			callback(['databaseError'], null)
		}else{
			callback([], challenges[0])
		}
	})
	
}

exports.createChallenge = function(challenge, callback){
	
	const query = `INSERT INTO challenges (title, challengeText, progLanguage, difficulty, description, datePublished, numOfPlays, userId) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	const values = [challenge.title, challenge.challengeText, challenge.progLanguage, challenge.difficulty, challenge.description, challenge.datePublished, challenge.numOfPlays, challenge.userId]
	
	db.query(query, values, function(error, results){
		if(error){
			// TODO: Look for challengeUnique violation.
			callback(['databaseError'], null)
		}else{
			callback([], results.insertId)
		}
	})
	
}



//Comments
exports.getCommentsByChallengeId = function(challengeId, callback){
	
	const query = `SELECT * FROM comments WHERE challengeId = ?`
	const values = [challengeId]
	
	db.query(query, values, function(error, comments){
		if(error){
			callback(['databaseError'], null)
		}else{
			callback([], comments)
		}
	})
	
}

exports.getCommentById = function(id, callback){
    
    const query = 'SELECT * FROM comments WHERE id = ? LIMIT 1'
    const values = [id]

    db.query(query, values, function(error, comments){
        if(error){
            callback(['databaseError'], null)
        }
        else{
            callback([], comments[0])
        }
    })
}

exports.createAccount = function(account, callback){
	
	const query = `INSERT INTO accounts (username, password) VALUES (?, ?)`
	const values = [account.username, account.password]
	
	db.query(query, values, function(error, results){
		if(error){
			// TODO: Look for usernameUnique violation.
			callback(['databaseError'], null)
		}else{
			callback([], results.insertId)
		}
	})
	
}