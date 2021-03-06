module.exports = function({validationVariabels, commentRepository}){
    return{
        getErrorsCreateComment: function(requesterUsername, comment){
            const errorCodes = []
    
            if(comment.accountUsername != requesterUsername){
                errorCodes.push(validationVariabels.notAuthorized)
            }

            if(comment.commentText.length < validationVariabels.MIN_COMMENT_LENGTH){
                errorCodes.push(validationVariabels.commentTooShort)
            }
            if(comment.commentText.length > validationVariabels.MAX_COMMENT_LENGTH){
                errorCodes.push(validationVariabels.commentTooLong)
            }

            return errorCodes
        },

        getErrorsUpdateComment: function(requesterUsername, commentId, newCommentText, callback){
            const errorCodes = []

            commentRepository.getCommentById(commentId, function(errors, comment){
                if(errors.length > 0){
                    errorCodes.push(...errors)
                    callback(errorCodes)
                }else{
                    if(comment.accountUsername != requesterUsername){
                        errorCodes.push(validationVariabels.notAuthorized)
                    }
                    if(newCommentText.length < validationVariabels.MIN_COMMENT_LENGTH){
                        errorCodes.push(validationVariabels.commentTooShort)
                    }
                    if(comment.commentText.length > validationVariabels.MAX_COMMENT_LENGTH){
                        errorCodes.push(validationVariabels.commentTooLong)
                    }

                    callback(errorCodes)
                }
            })
    
        },

        getErrorsDeleteComment: function(requesterUsername, commentId, callback){
            const errorCodes = []

            commentRepository.getCommentById(commentId, function(errors, comment){
                if(errors.length > 0){
                    errorCodes.push(...errors)
                    callback(errorCodes)
                } else{
                    if(comment.accountUsername != requesterUsername){
                        errorCodes.push(validationVariabels.notAuthorized)
                    }

                    callback(errorCodes)
                }
            })
        },

        getErrorsFetchComment: function(comment){
            const errorCodes = []

            if(comment == undefined){
                errorCodes.push(validationVariabels.commentNotExist)
            }

            return errorCodes
        }
    }
}

