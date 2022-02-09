const db = require('./db') 

/*
    Gets the solution corresponding to the specific challengeId
*/
exports.getSolutionsByChallengeId = function(challengeId, callback){
    const query = "GET * FROM solutions WHERE challengeId = ?"
    const values = [challengeId]

    db.query(query,values,function(error, solutions){
        if(error){
            callback(['databaseError'], null) // handle errors at later date.
        }else{
            callback([], solutions)
        }
    })
}