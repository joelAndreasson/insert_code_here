

module.exports = function({initSequelize, validationVariabels}){
    return {
        getCommentById: function(id, callback){
            initSequelize.comments.findByPk(id, {raw: true})
                .then(comment => callback([], comment))
                .catch(error => {
                    console.log(error)
                    callback([validationVariabels.databaseError], null)
                })
        },

        getCommentsByChallengeId: function(challengeId, callback){
            initSequelize.comments.findAll({where: {challengeId: challengeId}, raw: true})
                .then(comments => callback([], comments))
                .catch(error => {
                    console.log(error)
                    callback([validationVariabels.databaseError], null)
                })
        },

        createComment: function(comment, callback){
            initSequelize.comments.create(comment, {raw: true})
                .then(createdComment => callback([], createdComment.id))
                .catch(error => {
                    console.log(error)
                    callback([validationVariabels.databaseError], null)
                })
        },

        deleteCommentById: function(commentId, callback){
            initSequelize.comments.destroy({where: {id: commentId}, raw: true})
                .then(results => callback([], results))
                .catch(error => {
                    console.log(error)
                    callback([validationVariabels.databaseError], null)
                })
        },

        updateCommentById: function(commentId, newCommentText, callback){
            initSequelize.comments.update({
                commentText: newCommentText
            }, {
                where: {id: commentId}, 
                raw: true
            })
            .then(results => callback([], results))
            .catch(error => {
                console.log(error)
                callback([validationVariabels.databaseError], null)
            })
        }

    }
}