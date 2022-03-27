const express = require('express')

module.exports = function({commentManager, errorTranslator}){
    const router = express.Router({ mergeParams: true })

    router.get('/create', function(request, response){
        const challengeId = request.params.challengeId
        
        const model = {
            challengeId: challengeId
        }

        response.render('comment-create.hbs', model)
    })

    router.post('/create', function(request, response){

        const comment = {
            commentText: request.body.commentText,
            accountUsername: request.body.accountUsername, // Should come from the body of the request!!!!!!!!!!!!!!
            challengeId: request.params.challengeId
        }

        const requesterUsername = request.session.accountUsername
        commentManager.createComment(requesterUsername, comment, function(errorCodes, id){ // what is id for? 
            if(errorCodes.length > 0){
				const translatedErrors = errorTranslator.translateErrorCodes(errorCodes)
                const model = {
                    errors: translatedErrors,
                    challengeId: comment.challengeId,
                    comment: comment
                }

                response.render('comment-create.hbs', model)
            }
            else{
                response.redirect('/challenges/' + comment.challengeId + '/preview') // REMOVE PREVIEW !!
            }
        })
    })

    router.get('/:commentId/delete', function(request, response){
        const commentId = request.params.commentId
        const challengeId = request.params.challengeId

        commentManager.getCommentById(commentId, function(errorCodes, comment){
            if(errorCodes.length > 0){
                if(errorCodes.includes("commentNotExist")){
                    response.render('page-not-found.hbs')
                }else {
                    request.render('internal-server-error.hbs')
                }
            }else {
                var isOwner = false
                if(request.session.accountUsername == comment.accountUsername){
                    isOwner = true
                }

                const model = {
                    isOwner: isOwner,
                    commentId: commentId,
                    challengeId: challengeId
                }

                response.render('comment-delete.hbs', model)
            }
        })

        

    })

    router.post('/:commentId/delete', function(request, response){
        const commentId = request.params.commentId
        const challengeId = request.params.challengeId

        const requesterUsername = request.session.accountUsername
        commentManager.deleteCommentById(requesterUsername, commentId, function(errorCodes){
            if(errorCodes.length > 0){
                response.render('internal-server-error.hbs')
            }else {
                response.redirect('/challenges/'+challengeId+'/preview')
            }
        })
    })

    router.get('/:commentId/update', function(request, response){
        const commentId = request.params.commentId

        commentManager.getCommentById(commentId, function(errorCodes, comment){
            if(errorCodes.length > 0){
                if(errorCodes.includes("commentNotExist")){
                    response.render('page-not-found.hbs')
                }else {
                    request.render('internal-server-error.hbs')
                }
            }else {

                var isOwner = false
                if(request.session.accountUsername == comment.accountUsername){
                    isOwner = true
                }

                const model = {
                    comment: comment,
                    isOwner: isOwner
                }
                response.render('comment-update.hbs', model)
            }
        })
    })

    router.post('/:commentId/update', function(request, response){
        const challengeId = request.params.challengeId
        const commentId = request.params.commentId
        const newCommentText = request.body.commentText
        const isOwner = request.body.isOwner
        
        const requesterUsername = request.session.accountUsername
        commentManager.updateCommentById(requesterUsername, commentId, newCommentText, function(errorCodes){
            
            if(errorCodes.length > 0){
                const translatedErrors = errorTranslator.translateErrorCodes(errorCodes)
                const model = {
                    isOwner: isOwner,
                    errors: translatedErrors,
                    comment: {
                        id: commentId,
                        challengeId: challengeId,
                        commentText: newCommentText
                    }
                }
                response.render('comment-update.hbs', model)
            }else {
                response.redirect('/challenges/'+challengeId+'/preview')
            }
        })
    })

    router.get('/:commentId/preview', function(request, response){ // REMOVE PREVIEW !!
        const commentId = request.params.commentId

        commentManager.getCommentById(commentId, function(errorCodes, comment){
            if(errorCodes.length > 0){
                if(errorCodes.includes("commentNotExist")){
                    response.render('page-not-found.hbs')
                }else {
                    request.render('internal-server-error.hbs')
                }
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

