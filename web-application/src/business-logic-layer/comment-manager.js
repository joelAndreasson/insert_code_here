const commentRepository = require('../data-access-layer/comment-repository')
const commentValidator = require('../business-logic-layer/comment-validator')


exports.getCommentById = function(id, callback){
    commentRepository.getCommentById(id, callback)
}

exports.getCommentsByChallengeId = function(challengeId, callback){
    commentRepository.getCommentsByChallengeId(challengeId, callback)
}

exports.createComment = function(comment, callback){

	const errors = commentValidator.getErrorsNewComment(comment)
	
	if(0 < errors.length){
		callback(errors, null)
		return
	}

    commentRepository.createComment(comment, callback)
}