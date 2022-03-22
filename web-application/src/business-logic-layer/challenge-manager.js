module.exports = function({challengeRepository, challengeValidator, validationVariabels}){
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

		getResultsFromChallengeTextWithId: function(challengeId, changedChallengeText, callback){
			const increase = 1

			challengeRepository.getChallengeById(challengeId, function(errors, challenge){
				if(errors.length > 0){
					callback(errors, null, null, null)
					return
				}
				else{
					const enteredAnswers = changedChallengeText.match(validationVariabels.SOLUTIONS_REGEX)
					const solutionAnswers = challenge.solutionText.match(validationVariabels.SOLUTIONS_REGEX)
			
					const validationErrors = challengeValidator.getErrorsPlayChallenge(enteredAnswers, solutionAnswers)
			
					if(validationErrors.length > 0){
						callback(validationErrors, null, null, challenge)
						return
					}
					else{
						challengeRepository.increaseNumOfPlays(challenge.id, (challenge.numOfPlays + increase), function(errors, results){
							if(errors.length > 0){
								callback(errors, null)
							}else {
								let numOfRightAnswers = 0
								let totalNumOfAnswers = solutionAnswers.length
								for(i = 0; i < totalNumOfAnswers; i+=1){
									numOfRightAnswers += enteredAnswers[i] == solutionAnswers[i] ? 1 : 0
								}
						
								callback([], numOfRightAnswers, totalNumOfAnswers, null)
								}
						})
					}
				}
			})
		},

		getAllChallenges: function(callback){
			challengeRepository.getAllChallenges(callback)
		}, 

		getChallengeById: function(challengeId, callback){
			challengeRepository.getChallengeById(challengeId, callback)
		},

		createChallenge: function(challenge, callback){
			const validationErrors = challengeValidator.getErrorsNewChallenge(challenge)
	
			if(0 < validationErrors.length){
				callback(validationErrors, null)
				return
			}
			
			challengeRepository.createChallenge(challenge, callback)
		},

		getChallengesByUsername: function(accountUsername, callback){
			challengeRepository.getChallengesByUsername(accountUsername, callback)
		},

		increaseNumOfPlaysByOne : function(challengeId, currentNumOfPlays, callback){
			challengeRepository.increaseNumOfPlaysByOne(challengeId, (currentNumOfPlays + 1), callback)
		},

		deleteChallengeById: function(challengeId, callback){
			challengeRepository.deleteChallengeById(challengeId, callback)
		},

		updateChallengeById: function(challengeId, updatedChallenge, callback){
			const validationErrors = challengeValidator.getErrorsNewChallenge(updatedChallenge)

			if(0 < validationErrors.length){
				callback(validationErrors, null)
				return
			}

			challengeRepository.updateChallengeById(challengeId, updatedChallenge, callback)
		}
	}
}

