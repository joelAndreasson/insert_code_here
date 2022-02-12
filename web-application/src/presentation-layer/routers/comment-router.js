const express = require('express')
const commentManager = require('../../business-logic-layer/comment-manager')

const router = express.Router({ mergeParams: true })

router.get("/create", function(request, response){
    const challengeId = request.params.id

    const model = {
        challengeId: challengeId
    }

	response.render("comment-create.hbs", model)
})

router.post('/create', function(request, response){
	const commentText = request.body.commentText
    const userId = 42 // Hardcoded dummy value, replace with actual accountId
    const challengeId = request.params.id

	const comment = new commentManager.Comment(commentText, userId, challengeId)

	commentManager.createComment(comment, function(error, id){
		// TODO: Add error handling
		response.redirect('/challenges/' + challengeId + '/preview')
	})

})

module.exports = router