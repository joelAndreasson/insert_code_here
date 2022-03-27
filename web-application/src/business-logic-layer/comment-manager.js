

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

		createComment: function(comment, callback){
			const validationErrorCodes = commentValidator.getErrorsCreateComment(comment)
	
			if(0 < validationErrorCodes.length){
				callback(validationErrorCodes, null)
				return
			}

			commentRepository.createComment(comment, callback)
		},

		getCommentsByUsername: function(username, callback){
			commentRepository.getCommentsByUsername(username, callback)
		},

		deleteCommentById: function(commentId, callback){
			commentRepository.deleteCommentById(commentId, callback)
		}, 

		updateCommentById: function(commentId, newCommentText, callback){
			const validationErrorCodes = commentValidator.getErrorsUpdateComment(newCommentText)
	
			if(0 < validationErrorCodes.length){
				callback(validationErrorCodes, null)
				return
			}
			commentRepository.updateCommentById(commentId, newCommentText, callback)
		}
	}
}

