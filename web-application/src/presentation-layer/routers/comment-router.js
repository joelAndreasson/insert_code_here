const express = require('express')

module.exports = function({commentManager, errorTranslator}){
    const router = express.Router({ mergeParams: true })

    router.get("/create", function(request, response){
        const challengeId = request.params.challengeId
        
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

    router.get('/:commentId/delete', function(request, response){
        const commentId = request.params.commentId
        const challengeId = request.params.challengeId

        const model = {
            commentId: commentId,
            challengeId: challengeId
        }

        response.render('comment-delete.hbs', model)

    })

    router.post('/:commentId/delete', function(request, response){
        const commentId = request.params.commentId
        const challengeId = request.params.challengeId

        commentManager.deleteCommentById(commentId, function(errors){
            if(errors.length > 0){
                response.render("internal-server-error.hbs")
            }else {
                response.redirect('/challenges/'+challengeId+'/preview')
            }
        })
    })

    router.get('/:commentId/update', function(request, response){
        const commentId = request.params.commentId

        commentManager.getCommentById(commentId, function(errors, comment){
            if(errors.length > 0){
                response.render("internal-server-error.hbs")
            }else {

                var isOwner = false
                if(request.session.accountUsername == comment.accountUsername){
                    isOwner = true
                }

                const model = {
                    comment: comment,
                    isOwner: isOwner
                }
                response.render("comment-update.hbs", model)
            }
        })
    })

    router.post('/:commentId/update', function(request, response){
        const challengeId = request.params.challengeId
        const commentId = request.params.commentId
        const newCommentText = request.body.commentText
        
        commentManager.updateCommentById(commentId, newCommentText, function(errors){
            if(errors.length > 0){
                const errorCodes = errorTranslator.translateErrorCodes(errors)
                const comment = {

                }
                const model = {
                    errors: errorCodes,
                    comment: {
                        id: commentId,
                        commentText: newCommentText
                    }
                }
                response.render('comment-update.hbs', model)
            }else {
                response.redirect('/challenges/'+challengeId+'/preview')
            }
        })
    })

    router.get('/:commentId/preview', function(request, response){
        const commentId = request.params.commentId

        commentManager.getCommentById(commentId, function(errors, comment){
            if(errors.length > 0){
                response.render('internal-server-error.hbs')
            }else {
                var isOwner = false
                if(request.session.accountUsername == comment.accountUsername){
                    isOwner = true
                }

                const model = {
                    comment: comment,
                    isOwner: isOwner
                }
                response.render('comment-preview.hbs', model)
            }
        })
    })


    return router
}

