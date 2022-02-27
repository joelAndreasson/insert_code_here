

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
            initSequelize.challenges.create(challenge)
            .then(createdChallenge => callback([], createdChallenge.id))
            .catch(error => {
                console.log(error)
                    callback(['databaseError'], null)
            })
        }
    }
}
