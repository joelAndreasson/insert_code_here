const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('postgres//:postgres:hejsan123@postgres:5432/postgresDatabase') // Put this is init-sequelize

const comments = sequelize.define('comments', {
    commentText: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    challengeId: DataTypes.INTEGER
})

comments.sync()

module.exports = function({}){
    return {
        getCommentById: function(id, callback){
            comments.findByPk(id)
                .then(comment => callback([], comment))
                .catch(error => {
                    callback(['databaseError'], null)
                })
        },

        getCommentsByChallengeId: function(challengeId, callback){
            comments.findAll({where: {challengeId: challengeId}})
                .then(comments => callback([], comments))
                .catch(error => callback(['databaseError'], null))
        },

        createComment: function(comment, callback){
            comments.create({
                commentText: comment.commentText,
                userId: comment.userId,
                challengeId: comment.challengeId
            })
            .then(createdComment => callback([], createdComment.id))
            .catch(error => callback(['databaseError'], null))
        }

    }
}