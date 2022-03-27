

module.exports = function({commentRepository, commentValidator}){
	return{
		getCommentById: function(id, callback){
			commentRepository.getCommentById(id, function(errorCodes, comment){
				const validationErrors = commentValidator.getErrorsFetchComment(comment)

				if(validationErrors.length > 0){
					callback(validationErrors, comment)
				}else {
					callback([], comment)
				}
			})
		},

		getCommentsByChallengeId: function(challengeId, callback){
			commentRepository.getCommentsByChallengeId(challengeId, callback)
		},

		createComment: function(requesterUsername, comment, callback){ // CALL VALIDATOR AND CHECK OWNER
			const validationErrors = commentValidator.getErrorsCreateComment(requesterUsername, comment)
	
			if(0 < validationErrors.length){
				callback(validationErrors, null)
				return
			}

			commentRepository.createComment(comment, callback)
		},

		getCommentsByUsername: function(username, callback){
			commentRepository.getCommentsByUsername(username, callback)
		},

		deleteCommentById: function(requesterUsername, commentId, callback){ // CALL VALIDATOR AND CHECK OWNER
			commentValidator.getErrorsDeleteComment(
				requesterUsername, 
				commentId, 
				function(validationErrors){
					if(0 < validationErrors.length){
						callback(validationErrors, null)
						return
					}
					commentRepository.deleteCommentById(commentId, callback)
				}
			)
			
		}, 

		updateCommentById: function(requesterUsername, commentId, newCommentText, callback){ // CALL VALIDATOR AND CHECK OWNER
			commentValidator.getErrorsUpdateComment(
				requesterUsername, 
				commentId, 
				newCommentText, 
				function(validationErrors){
					if(0 < validationErrors.length){
						callback(validationErrors, null)
						return
					}
					commentRepository.updateCommentById(commentId, newCommentText, callback)
				}
			)
	
			
		}
	}
}

