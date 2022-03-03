

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

		getChallengeById: function(id, callback){
			const query = `SELECT * FROM challenges WHERE id = ? LIMIT 1`
			const values = [id]
			
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
					// TODO: Look for challengeUnique violation.
					callback(['databaseError'], null)
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

		increaseNumOfPlays: function(challengeId, newNumOfPlays, callback){ // numOfPlays should be increased in bussiness logic layer and then call this function  
			const query = `UPDATE challenges SET numOfPlays = ? WHERE id = ?`
			const values = [newNumOfPlays, challengeId]

			db.query(query, values, function(error, results){
				if(error){
					callback(['databaseError'], null)
				}else {
					callback([], results)
				}
			})
		}
	}
}