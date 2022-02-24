

module.exports = function({db}){
	return{
		getAllChallenges: function(callback){
			const query = 'SELECT * FROM challenges ORDER BY id DESC'
			const values = []

			db.query(query, values, function(error, challenges){
				if(error){
					//console.log(error)
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
					userId) 
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
				challenge.userId
			]
			
			db.query(query, values, function(error, results){
				if(error){
					// TODO: Look for challengeUnique violation.
					callback(['databaseError'], null)
				}else{
					callback([], results.insertId)
				}
			})
		}
	}
}