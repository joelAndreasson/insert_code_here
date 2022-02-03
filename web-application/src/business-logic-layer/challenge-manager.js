const challengeRepository = require('../data-access-layer/challenges-repository') // CHALLENGE!! SINGULAR


exports.getAllChallenges = function(callback){
	challengeRepository.getAllChallenges(callback)
}

exports.getChallengeById = function(id, callback){
	challengeRepository.getChallengeById(id, callback)
}

exports.createChallenge = function(account, callback){
	
	/* TODO: Validate challenge
	const errors = accountValidator.getErrorsNewAccount(account)
	
	if(0 < errors.length){
		callback(errors, null)
		return
	}
    */
	
	challengeRepository.createChallenge(challenge, callback)
	
}