const express = require('express')

module.exports = function({commentManager, errorTranslator}){
    const router = express.Router({ mergeParams: true })

    router.get("/create", function(request, response){
        const challengeId = request.params.id
        
        const model = {
            challengeId: challengeId
        }

        response.render("comment-create.hbs", model)
    })

    router.post('/create', function(request, response){

        const comment = {
            commentText: request.body.commentText,
            accountUsername: request.session.accountUsername,
            challengeId: request.params.id
        }

        commentManager.createComment(comment, function(errors, id){ // what is id for? 
            if(errors.length > 0){
				const errorCodes = errorTranslator.translateErrorCodes(errors)
                const model = {
                    errors: errorCodes,
                    challengeId: comment.challengeId,
                    comment: comment
                }

                response.render('comment-create.hbs', model)
            }
            else{
                response.redirect('/challenges/' + comment.challengeId + '/preview')
            }
        })
    })

    return router
}

