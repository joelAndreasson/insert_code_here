const challengeRepository = require('../data-access-layer/challenge-repository')
const challengeValidator = require('../business-logic-layer/challenge-validator')

exports.getTodaysDate = function(){ //Should maybe be moved elsewhere?
	const today = new Date()

	const yyyy = today.getFullYear()

	let mm = today.getMonth()
	mm = mm < 10 ? "0" + mm : mm;

	let dd = today.getDay()
	dd = dd < 10 ? "0" + dd : dd;

	return yyyy + "-" + mm + "-" + dd
}

exports.getResultsFromChallengeTextWithId = function(id, changedChallengeText, callback){

	challengeRepository.getChallengeById(id, function(errors, challenge){
		//TODO: Error handling

		const regex = /(?<=\[\[).*?(?=\]\])/g

		const enteredAnswers = changedChallengeText.match(regex)
		const solutionAnswers = challenge.solutionText.match(regex)

		let numOfRightAnswers = 0
		let totalNumOfAnswers = solutionAnswers.length
		for(i = 0; i < totalNumOfAnswers; i+=1){
			numOfRightAnswers += enteredAnswers[i] == solutionAnswers[i] ? 1 : 0
		}

		callback([], numOfRightAnswers, totalNumOfAnswers)
	})
}


exports.getAllChallenges = function(callback){
	challengeRepository.getAllChallenges(callback)
}

exports.getChallengeById = function(id, callback){
	challengeRepository.getChallengeById(id, callback)
}

exports.createChallenge = function(challenge, callback){
	
	const errors = challengeValidator.getErrorsNewChallenge(challenge)
	
	if(0 < errors.length){
		callback(errors, null)
		return
	}
	
	challengeRepository.createChallenge(challenge, callback)
}