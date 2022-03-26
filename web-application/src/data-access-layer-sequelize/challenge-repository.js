

module.exports = function({initSequelize}){
    return {
        getAllChallenges: function(callback){
            initSequelize.challenges.findAll({raw: true})
                .then(challenges => callback([], challenges))
                .catch(error => {
                    console.log(error)
                    callback(['databaseError'], null)
                })
        },

        getChallengeById: function(id, callback){
            initSequelize.challenges.findByPk(id, {raw: true})
                .then(challenge => callback([], challenge))
                .catch(error => {
                    console.log(error)
                    callback(['databaseError'], null)
                })
        },

        createChallenge: function(challenge, callback){
            initSequelize.challenges.create(challenge, {raw: true})
            .then(createdChallenge => callback([], createdChallenge.id))
            .catch(error => {
                console.log(error)
                    callback(['databaseError'], null)
            })
        },

        getChallengesByUsername: function(accountUsername, callback){
            initSequelize.challenges.findAll({where: {accountUsername: accountUsername}, raw: true})
                .then(challenges => callback([], challenges))
                .catch(error => {
                    console.log(error)
                    callback(['databaseError'], null)
                })
        },

        deleteChallengeById: function(challengeId, callback){
            initSequelize.challenges.destroy({where: {id: challengeId}, raw: true})
                .then(results => callback([], results))
                .catch(error => {
                    console.log(error)
                    callback(['databaseError'], null)
                })
        },

        updateChallengeById: function(challengeId, updatedChallenge, callback){
            initSequelize.challenges.update({
                title: updatedChallenge.title,
                challengeText: updatedChallenge.challengeText,
                solutionText: updatedChallenge.solutionText,
                progLanguage: updatedChallenge.progLanguage,
                difficulty: updatedChallenge.difficulty,
                description: updatedChallenge.description
            }, {
                where: {id: challengeId}, 
                raw: true
            })
            .then(results => callback([], results))
            .catch(error => {
                console.log(error)
                callback(['databaseError'], null)
            })
        }, 

        getTopThreePlayedChallenges: function(callback){
            initSequelize.challenges.findAll({order: [['numOfPlays', 'DESC']], limit: 3, raw: true})
                .then(challenges => callback([], challenges))
                .catch(error => {
                    console.log(error)
                    callback(['databaseError'], null)
                })
        },

        updateNumOfPlays: function(challengeId, newNumOfPlays, callback){
            initSequelize.challenges.update({
                numOfPlays: newNumOfPlays,
            }, {
                where: {id: challengeId}, 
                raw: true
            })
            .then(results => callback([], results))
            .catch(error => {
                console.log(error)
                callback(['databaseError'], null)
            })
        }

    }
}
