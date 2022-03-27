module.exports = function({challengeRepository, challengeValidator, validationVariabels}){
	return {
		getTodaysDate: function(){
			const today = new Date()
			
			var dd = String(today.getDate()).padStart(2, '0')
			var mm = String(today.getMonth() + 1).padStart(2, '0')
			var yyyy = today.getFullYear()


			/*console.log(today)
			const yyyy = today.getUTCFullYear()
			console.log(yyyy)
			let mm = today.getUTCMonth()
			console.log(mm)
			mm = mm < 10 ? "0" + mm : mm;

			let dd = today.getUTCDay()
			console.log(dd)
			dd = dd < 10 ? "0" + dd : dd;

			console.log(yyyy + "-" + mm + "-" + dd)*/

			return yyyy + "-" + mm + "-" + dd
		},

		getResultsFromChallengeTextWithId: function(challengeId, changedChallengeText, callback){
			const increase = 1

			challengeRepository.getChallengeById(challengeId, function(errorCodes, challenge){
				if(errorCodes.length > 0){
					callback(errorCodes, null, null, null)
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
						challengeRepository.updateNumOfPlays(challenge.id, (challenge.numOfPlays + increase), function(errorCodes, results){
							if(errorCodes.length > 0){
								callback(errorCodes, null)
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
			
			challengeRepository.getChallengeById(challengeId, function(errorCodes, challenge){
				var allErrors = []

				errors.push(...errorCodes)
				const validationErrorCodes = challengeValidator.getErrorsFetchChallenge(challenge)
				errors.push(...validationErrorCodes)
				if(allErrors.length > 0){
					callback(allErrors, challenge)
				}else {
					callback([], challenge)
				}
			})
		},

		createChallenge: function(challenge, callback){
			const validationErrorCodes = challengeValidator.getErrorsNewChallenge(challenge)
	
			if(0 < validationErrorCodes.length){
				callback(validationErrorCodes, null)
				return
			}
			
			challengeRepository.createChallenge(challenge, callback)
		},

		getChallengesByUsername: function(accountUsername, callback){
			challengeRepository.getChallengesByUsername(accountUsername, callback)
		},

		updateNumOfPlays : function(challengeId, currentNumOfPlays, callback){
			challengeRepository.updateNumOfPlays(challengeId, (currentNumOfPlays + 1), callback)
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
		},

		getTopThreePlayedChallenges: function(callback){
			challengeRepository.getTopThreePlayedChallenges(callback)
		},

		deleteChallengeById: function(challengeId, callback){
			challengeRepository.deleteChallengeById(challengeId, function(errorCodes, results){
				if(errorCodes.length > 0){
					callback(errorCodes, null)
				}else {
					callback([], results)
				} 
			})
		}
		
	}
}

