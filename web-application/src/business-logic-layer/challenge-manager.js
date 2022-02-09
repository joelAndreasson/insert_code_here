const challengeRepository = require('../data-access-layer/challenge-repository')

exports.getTodaysDate = function(){
	const today = new Date()

	const yyyy = today.getFullYear()

	let mm = today.getMonth()
	mm = mm < 10 ? "0" + mm : mm;

	let dd = today.getDay()
	dd = dd < 10 ? "0" + dd : dd;

	return yyyy + "-" + mm + "-" + dd
}

exports.Challenge = class Challenge{
	constructor(title, challengeText, progLanguage, difficulty, description, datePublished, numOfPlays, userId){
		this.title = title
		this.challengeText = challengeText
		this.progLanguage = progLanguage
		this.difficulty = difficulty
		this.description = description
		this.datePublished = datePublished
		this.numOfPlays = numOfPlays
		this.userId = userId
	}
}


exports.getAllChallenges = function(callback){
	challengeRepository.getAllChallenges(callback)
}

exports.getChallengeById = function(id, callback){
	challengeRepository.getChallengeById(id, callback)
}

exports.createChallenge = function(challenge, callback){
	
	/* TODO: Validate challenge
	const errors = accountValidator.getErrorsNewAccount(account)
	
	if(0 < errors.length){
		callback(errors, null)
		return
	}
    */
	
	challengeRepository.createChallenge(challenge, callback)
	
}