
const MIN_COMMENT_LENGTH = 5

exports.getErrorsNewComment = function(comment){

    errors = []

    
    if(comment.commentText.length < MIN_COMMENT_LENGTH){
        errors.push("Comment needs to be at least " + MIN_COMMENT_LENGTH + " characters")
    }

    console.log(errors)

    return errors
}