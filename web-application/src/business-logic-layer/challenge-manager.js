module.exports = function({challengeRepository, challengeValidator, validationVariabels}){
	return {
		getTodaysDate: function(){
			const today = new Date()
			
			var dd = String(today.getDate()).padStart(2, '0')
			var mm = String(today.getMonth() + 1).padStart(2, '0')
			var yyyy = today.getFullYear()

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
				const validationErrors = challengeValidator.getErrorsFetchChallenge(challenge)
				if(validationErrors.length > 0){
					callback(validationErrors, challenge)
				}else {
					callback([], challenge)
				}
			})
		},

		createChallenge: function(requesterUsername, challenge, callback){
			const validationErrorCodes = challengeValidator.getErrorsNewChallenge(requesterUsername, challenge)
	
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

		deleteChallengeById: function(requesterUsername, challengeId, callback){// CALL VALIDATOR AND CHECK OWNER
			challengeValidator.getErrorsDeleteChallenge(
				challengeId, 
				requesterUsername, 
				function(validationErrors){

					if(0 < validationErrors.length){
						callback(validationErrors, null)
						return
					}
		
					challengeRepository.deleteChallengeById(challengeId, callback)
				}
			)

		},

		updateChallengeById: function(requesterUsername, challengeId, updatedChallenge, callback){
			challengeValidator.getErrorsUpdateChallenge(
				requesterUsername, 
				challengeId,
				updatedChallenge, 
				function(validationErrors){
					if(0 < validationErrors.length){
						callback(validationErrors, null)
						return
					}

					challengeRepository.updateChallengeById(challengeId, updatedChallenge, callback)
				}
			) 
			
		},

		getTopThreePlayedChallenges: function(callback){
			challengeRepository.getTopThreePlayedChallenges(callback)
		},
		
	}
}

