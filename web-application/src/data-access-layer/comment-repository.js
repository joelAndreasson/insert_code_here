

module.exports = function({db, validationVariabels}){
    return{
        getCommentById: function(id, callback){
            const query = 'SELECT * FROM comments WHERE id = ? LIMIT 1'
            const values = [id]

            db.query(query, values, function(error, comments){
                if(error){
                    callback([validationVariabels.databaseError], null)
                }else{
                    callback([], comments[0])
                }
            })
        },

        getCommentsByChallengeId: function(challengeId, callback){
            const query = 'SELECT * FROM comments WHERE challengeId = ? ORDER BY id DESC'
            const values = [challengeId]

            db.query(query, values, function(error, comments){
                if(error){
                    callback([validationVariabels.databaseError], null)
                }else{
                    callback([], comments)
                }
            })
        },

        createComment: function(comment, callback){
            const query = `INSERT INTO comments (commentText, accountUsername, challengeId) VALUES (?, ?, ?)`
            const values = [comment.commentText, comment.accountUsername, comment.challengeId]
            
            db.query(query, values, function(error, results){
                if(error){
                    if(error.code == "ER_NO_REFERENCED_ROW_2"){
                        callback([validationVariabels.challengeNotExist], null)
                    }else {
                        callback([validationVariabels.databaseError], null)
                    }
                }else{
                    callback([], results.insertId)
                }
            })
        },

        getCommentsByUsername: function(username, callback){
            const query = `SELECT * FROM comments WHERE accountUsername = ?`
            const values = [username]

            db.query(query, values, function(error, comments){
                if(error){
                    callback([validationVariabels.databaseError], null)
                }else {
                    callback([], comments)
                }
            })
        },

        deleteCommentById: function(commentId, callback){
            const query = `DELETE FROM comments WHERE id = ?`
            const values = [commentId]

            db.query(query, values, function(error){
                if(error){
                    callback([validationVariabels.databaseError], null)
                }else {
                    callback([], null)
                }
            })
        },

        updateCommentById: function(commentId, newCommentText, callback){
            const query = `UPDATE comments SET commentText = ? WHERE id = ?`
            const values = [newCommentText, commentId]

            db.query(query, values, function(error){
                if(error){
                    callback([validationVariabels.databaseError], null)
                }else {
                    callback([], null)
                }
            })
        }
    }
}

