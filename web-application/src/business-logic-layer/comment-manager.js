const commentRepository = require('../data-access-layer/comment-repository')


exports.Comment = class Comment{
    constructor(commentText, userId, challengeId){
        this.commentText = commentText
        this.userId = userId
        this.challengeId = challengeId
    }
}

exports.getCommentById = function(id, callback){
    commentRepository.getCommentById(id, callback)
}

exports.getCommentsByChallengeId = function(challengeId, callback){
    commentRepository.getCommentsByChallengeId(challengeId, callback)
}

exports.createComment = function(comment, callback){

    /* TODO: Validate comment
	const errors = accountValidator.getErrorsNewAccount(account)
	
	if(0 < errors.length){
		callback(errors, null)
		return
	}
    */

    commentRepository.createComment(comment, callback)
}