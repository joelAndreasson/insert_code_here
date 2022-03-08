const express = require('express')

module.exports = function({commentManager}){
    const router = express.Router({ mergeParams: true })

    router.get("/create", function(request, response){
        const challengeId = request.params.challengeId
        
        // TODO: Error handeling
        const model = {
            challengeId: challengeId
        }

        response.render("comment-create.hbs", model)
    })

    router.post('/create', function(request, response){

        const comment = {
            commentText: request.body.commentText,
            accountUsername: request.session.accountUsername,
            challengeId: request.params.challengeId
        }

        commentManager.createComment(comment, function(errors, id){
            if(errors.length > 0){
                const model = {
                    errors: errors,
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

