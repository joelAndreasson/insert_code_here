

module.exports = function({db}){
	return{
		getAllChallenges: function(callback){
			const query = 'SELECT * FROM challenges ORDER BY id DESC'
			const values = []

			db.query(query, values, function(error, challenges){
				if(error){
					callback(['databaseError'], null)
				}
				else{
					callback([], challenges)
				}
			})
		},

		getChallengeById: function(challengeId, callback){
			const query = `SELECT * FROM challenges WHERE id = ? LIMIT 1`
			const values = [challengeId]
			
			db.query(query, values, function(error, challenges){
				if(error){
					callback(['databaseError'], null)
				}else{
					callback([], challenges[0])
				}
			})
		},

		createChallenge: function(challenge, callback){
			const query = `INSERT INTO challenges (
					title, 
					challengeText, 
					solutionText, 
					progLanguage, 
					difficulty, 
					description, 
					datePublished, 
					numOfPlays, 
					accountUsername) 
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

			const values = [
				challenge.title, 
				challenge.challengeText, 
				challenge.solutionText, 
				challenge.progLanguage, 
				challenge.difficulty, 
				challenge.description, 
				challenge.datePublished, 
				challenge.numOfPlays, 
				challenge.accountUsername
			]
			
			db.query(query, values, function(error, results){
				if(error){
					if(error.code == "ER_NO_REFERENCED_ROW_2"){
                        callback(['accountNotExist'], null)
                    }else {
						callback(['databaseError'], null)
					}
				}else{
					callback([], results.insertId)
				}
			})
		},

		getChallengesByUsername: function(accountUsername, callback){
			const query = `SELECT * FROM challenges WHERE accountUsername = ?`
			const values = [accountUsername]

			db.query(query, values, function(error, challenges){
				if(error){
					callback(['databaseError'], null)
				}else {
					callback([], challenges)
				}
			})
		},

		updateNumOfPlays: function(challengeId, newNumOfPlays, callback){ // numOfPlays should be increased in bussiness logic layer and then call this function  
			const query = `UPDATE challenges SET numOfPlays = ? WHERE id = ?`
			const values = [newNumOfPlays, challengeId]

			db.query(query, values, function(error, results){
				if(error){
					callback(['databaseError'], null)
				}else {
					callback([], results)
				}
			})
		},

		deleteChallengeById: function(challengeId, callback){
			const query = `DELETE FROM challenges WHERE id = ?`
			const values = [challengeId]

			db.query(query, values, function(error, results){
				if(error){
					console.log(error)
					callback(['databaseError'], null)
				}
				else {
					callback([], results)
				}
			})
		},

		updateChallengeById: function(challengeId, updatedChallenge, callback){
			const query = `UPDATE challenges SET 
				title = ?, 
				challengeText = ?,
				solutionText = ?,
				progLanguage = ?,
				difficulty = ?,
				description = ?
				WHERE id = ?`
			
			const values = [
				updatedChallenge.title, 
				updatedChallenge.challengeText, 
				updatedChallenge.solutionText, 
				updatedChallenge.progLanguage,
				updatedChallenge.difficulty,
				updatedChallenge.description,
				challengeId
			]

			db.query(query, values, function(error, results){ //Results or challenge?
				if(error){
					callback(['databaseError'], null)
				}
				else {
					callback([], results)
				}
			})
		},

		getTopThreePlayedChallenges: function(callback){
			const query = `SELECT * FROM challenges ORDER BY numOfPlays DESC LIMIT 3`
			
			db.query(query, function(error, challenges){
				if(error){	
					console.log(error)
					callback(['databaseError'], null)
				}else {
					callback([], challenges)
				}
			})
		}

	}
}