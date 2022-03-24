

module.exports = function({commentRepository, commentValidator}){
	return{
		getCommentById: function(id, callback){
			commentRepository.getCommentById(id, callback)
		},

		getCommentsByChallengeId: function(challengeId, callback){
			commentRepository.getCommentsByChallengeId(challengeId, callback)
		},

		createComment: function(comment, callback){
			const errors = commentValidator.getErrorsNewComment(comment)
	
			if(0 < errors.length){
				callback(errors, null)
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
			const errors = commentValidator.getErrorsUpdateComment(newCommentText)
	
			if(0 < errors.length){
				callback(errors, null)
				return
			}
			commentRepository.updateCommentById(commentId, newCommentText, callback)
		}
	}
}

