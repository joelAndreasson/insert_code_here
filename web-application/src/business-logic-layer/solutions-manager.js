const solutionsRepository = require('../data-access-layer/solutions-repository') // change name later to singular

exports.getSolutionByChallengeId = function(challengeId,callback){
    solutionsRepository.getSolutionByChallengeId(challengeId,callback)
}