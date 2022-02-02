const db = require('./db')


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

exports.createComment = function(comment, callback){
	
	const query = `INSERT INTO comments (commentText, userId, challengeId) VALUES (?, ?, ?)`
	const values = [comment.commentText, comment.userId, comment.challengeId]
	
	db.query(query, values, function(error, results){
		if(error){
			// TODO: Look for commentUnique violation.
			callback(['databaseError'], null)
		}else{
			callback([], results.insertId)
		}
	})
	
}