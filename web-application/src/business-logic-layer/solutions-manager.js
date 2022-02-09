const solutionsRepository = require('../data-access-layer/solutions-repository') // change name later to singular

exports.getSolutionsByChallengeId = function(challengeId,callback){
    solutionsRepository.getSolutionsByChallengeId(challengeId,callback)
}