const db = require('./db') 

/*
    Gets the solution corresponding to the specific challengeId
*/
exports.getSolutionByChallengeId = function(challengeId, callback){
    const query = "GET * FROM solutions WHERE challengeId = ? LIMIT 1"
    const values = [challengeId]

    db.query(query,values,function(error,solution){
        if(error){
            callback(['databaseError'], null) // handle errors at later date.
        }else{
            callback([], solution)
        }
    })
}