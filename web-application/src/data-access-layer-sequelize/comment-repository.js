

module.exports = function({initSequelize}){
    return {
        getCommentById: function(id, callback){
            initSequelize.comments.findByPk(id, {raw: true})
                .then(comment => callback([], comment))
                .catch(error => {
                    console.log(error)
                    callback(['databaseError'], null)
                })
        },

        getCommentsByChallengeId: function(challengeId, callback){
            initSequelize.comments.findAll({where: {challengeId: challengeId}, raw: true})
                .then(comments => callback([], comments))
                .catch(error => {
                    console.log(error)
                    callback(['databaseError'], null)
                })
        },

        createComment: function(comment, callback){
            initSequelize.comments.create(comment)
            .then(createdComment => callback([], createdComment.id))
            .catch(error => {
                console.log(error)
                    callback(['databaseError'], null)
            })
        }

    }
}