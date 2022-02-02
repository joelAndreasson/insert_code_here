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


/*Comments
exports.getCommentsByChallengeId = function(challengeId, callback){
	
	const query = `SELECT * FROM comments WHERE challengeId = ? LIMIT 1`
	const values = [username]
	
	db.query(query, values, function(error, accounts){
		if(error){
			callback(['databaseError'], null)
		}else{
			callback([], accounts[0])
		}
	})
	
}*/