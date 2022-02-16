const express = require('express')
const commentManager = require('../../business-logic-layer/comment-manager')

const router = express.Router({ mergeParams: true })

router.get("/create", function(request, response){
    const challengeId = request.params.id
    
    // TODO: Error handeling
    const model = {
        challengeId: challengeId
    }

	response.render("comment-create.hbs", model)
})

router.post('/create', function(request, response){

    const comment = {
        commentText: request.body.commentText,
        userId: 42, // Hardcoded dummy value, replace with actual accountId
        challengeId: request.params.id
    }

	commentManager.createComment(comment, function(error, id){
		// TODO: Add error handling
		response.redirect('/challenges/' + comment.challengeId + '/preview')
	})

})

module.exports = router