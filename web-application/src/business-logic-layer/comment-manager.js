

module.exports = function({commentRepository, commentValidator}){
	return{
		getCommentById: function(id, callback){
			commentRepository.getCommentById(id, function(errorCodes, comment){
				var allErrors = []

				allErrors.push(...errorCodes)
				const validationErrorCodes = commentValidator.getErrorsFetchComment(comment)
				allErrors.push(...validationErrorCodes)
				if(allErrors.length > 0){
					callback(allErrors, comment)
				}else {
					callback([], comment)
				}
			})
		},

		getCommentsByChallengeId: function(challengeId, callback){
			commentRepository.getCommentsByChallengeId(challengeId, callback)
		},

		createComment: function(requesterUsername, comment, callback){ // CALL VALIDATOR AND CHECK OWNER
			const validationErrorCodes = commentValidator.getErrorsCreateComment(requesterUsername, comment)
	
			if(0 < validationErrorCodes.length){
				callback(validationErrorCodes, null)
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
				function(validationErrorCodes){
					if(0 < validationErrorCodes.length){
						callback(validationErrorCodes, null)
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
				function(validationErrorCodes){
					if(0 < validationErrorCodes.length){
						callback(validationErrorCodes, null)
						return
					}
					commentRepository.updateCommentById(commentId, newCommentText, callback)
				}
			)
		}
	}
}

