module.exports = function({validationVariabels}){
    return{
        getErrorsCreateComment: function(comment){
            errors = []
    
            if(comment.commentText.length < validationVariabels.MIN_COMMENT_LENGTH){
                errors.push("commentTooShort")
            }

            return errors
        },

        getErrorsUpdateComment: function(newCommentText){
            errors = []
    
            if(newCommentText.length < validationVariabels.MIN_COMMENT_LENGTH){
                errors.push("commentTooShort")
            }

            return errors
        },

        getErrorsFetchComment: function(comment){
            errors = []

            if(comment == undefined){
                errors.push("commentNotExist")
            }

            return errors
        }
    }
}

