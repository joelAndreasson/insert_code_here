

const ANSWERS_REGEX = /(?<=\[\[).*?(?=\]\])/g // HARDCODED AT MULTIPLE PLACES, should be global instead?

module.exports = function({challengeRepository, challengeValidator}){
	return {
		getTodaysDate: function(){
			const today = new Date()

			const yyyy = today.getFullYear()

			let mm = today.getMonth()
			mm = mm < 10 ? "0" + mm : mm;

			let dd = today.getDay()
			dd = dd < 10 ? "0" + dd : dd;

			return yyyy + "-" + mm + "-" + dd
		},

		getResultsFromChallengeTextWithId: function(id, changedChallengeText, callback){
			challengeRepository.getChallengeById(id, function(errors, challenge){
				if(errors.length > 0){
					callback(errors, null, null, null)
					return
				}
				else{
					const enteredAnswers = changedChallengeText.match(ANSWERS_REGEX)
					const solutionAnswers = challenge.solutionText.match(ANSWERS_REGEX)
			
					const validationErrors = challengeValidator.getErrorsPlayChallenge(enteredAnswers, solutionAnswers)
			
					if(validationErrors.length > 0){
						callback(validationErrors, null, null, challenge)
						return
					}
					else{
						let numOfRightAnswers = 0
						let totalNumOfAnswers = solutionAnswers.length
						for(i = 0; i < totalNumOfAnswers; i+=1){
							numOfRightAnswers += enteredAnswers[i] == solutionAnswers[i] ? 1 : 0
						}
				
						callback([], numOfRightAnswers, totalNumOfAnswers, null)
					}
				}
			})
		},

		getAllChallenges: function(callback){
			challengeRepository.getAllChallenges(callback)
		}, 

		getChallengeById: function(id, callback){
			challengeRepository.getChallengeById(id, callback)
		},

		createChallenge: function(challenge, callback){
			const validationErrors = challengeValidator.getErrorsNewChallenge(challenge)
	
			if(0 < validationErrors.length){
				callback(validationErrors, null)
				return
			}
			
			challengeRepository.createChallenge(challenge, callback)
		}
	}
}

