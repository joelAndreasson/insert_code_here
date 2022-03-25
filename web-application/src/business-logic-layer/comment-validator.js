module.exports = function({validationVariabels}){
    return{
        getErrorsComment: function(comment){
            errors = []
    
            if(comment.commentText.length < validationVariabels.MIN_COMMENT_LENGTH){
                errors.push("commentTooShort")
            }

            return errors
        }
    }
}

