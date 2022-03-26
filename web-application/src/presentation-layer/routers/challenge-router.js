const express = require('express')

module.exports = function({challengeManager, commentManager, validationVariabels, errorTranslator}){
	const router = express.Router()

	router.get("/create", function(request, response){

		const model = {
			progLanguages: validationVariabels.ALL_PROG_LANGUAGES,
			difficulties: validationVariabels.ALL_DIFFICULTIES
		}

		response.render("challenge-create.hbs", model)
	})
	
	router.post('/create', function(request, response){
	
		const challenge = {
			title: request.body.title,
			challengeText: request.body.challengeText,
			solutionText: request.body.solutionText,
			progLanguage: request.body.progLanguage,
			difficulty: request.body.difficulty,
			description: request.body.description,
			datePublished: challengeManager.getTodaysDate(),
			numOfPlays: 0,
			accountUsername: request.body.accountUsername
		}
		
		challengeManager.createChallenge(challenge, function(errorCodes, challengeId){
			
			if(errorCodes.length > 0){
				const translatedErrors = errorTranslator.translateErrorCodes(errorCodes)
				const model = {
					errors: translatedErrors,
					challenge: challenge,
					progLanguages: validationVariabels.ALL_PROG_LANGUAGES,
					difficulties: validationVariabels.ALL_DIFFICULTIES
				}
				response.render('challenge-create.hbs', model)
			}
			else{
				response.redirect('/challenges/' + challengeId + '/preview')
			}
	
			
		})
	
	})
	
	router.get("/", function(request, response){
	
		challengeManager.getAllChallenges(function(errorCodes, challenges){
			if(errorCodes.length > 0){
				response.render("internal-server-error.hbs")
			}else {
				const model = {
					challenges: challenges
				}
				response.render("challenge-list.hbs", model)
			}
		})
	})
	
	router.get("/:challengeId/preview", function(request,response){
	
		const challengeId = request.params.challengeId
		
		let allErrors = [] // This is maybe unnecessary because there is a posibility that there will be two databaseError:s
	
		challengeManager.getChallengeById(challengeId, function(errorCodes, challenge){
			allErrors.push(...errorCodes)

			commentManager.getCommentsByChallengeId(challengeId, function(errorCodes, comments){
        
				allErrors.push(...errorCodes)
				if(allErrors.length > 0){
					if(allErrors.includes("challengeNotExist")){
						response.render('page-not-found.hbs')
					}else {
						response.render('internal-server-error.hbs')
					}	
				}else {
					const model = {
						challenge: challenge,
						comments: comments
					}
					response.render("challenge-preview.hbs", model)
				}
			})
		})
	})
	
	router.get('/:challengeId/play', function(request, response){
		const challengeId = request.params.challengeId
	
		challengeManager.getChallengeById(challengeId, function(errorCodes, challenge){
			if(errorCodes.length > 0){
				if(errorCodes.includes("challengeNotExist")){
					response.render('page-not-found.hbs')
				}else {
					response.render('internal-server-error.hbs')
				}	
			}else {
				const model = {
					challenge: challenge
				}
				response.render("challenge-play.hbs", model)
			}
		})
		
	})
	
	router.post('/:challengeId/play', function(request, response){
		const challengeId = request.params.challengeId
		const changedChallengeText = request.body.challengeText
	
		challengeManager.getResultsFromChallengeTextWithId(
			challengeId, 
			changedChallengeText, 
			function(errorCodes, numOfRightAnswers, totalNumOfAnswers, challenge){
				if(errorCodes.length > 0){
		
					challenge.challengeText = changedChallengeText
					
					const translatedErrors = errorTranslator.translateErrorCodes(errorCodes)
					const model = {
						errors: translatedErrors,
						challenge: challenge
					}
		
					response.render('challenge-play.hbs', model)
				}
				else{
					const model = {
						numOfRightAnswers: numOfRightAnswers,
						totalNumOfAnswers: totalNumOfAnswers,
						challengeId: challengeId
					}
				response.render('challenge-completed.hbs', model) // POST request should maybe redirect instead? How?
				}
			}
		)
	})

	router.get('/:challengeId/delete', function(request, response){
		const challengeId = request.params.challengeId
		challengeManager.getChallengeById(challengeId, function(errorCodes, challenge){
			if(errorCodes.length > 0){
				if(errorCodes.includes("challengeNotExist")){
					response.render('page-not-found.hbs')
				}else {
					response.render('internal-server-error.hbs')
				}	
			}else {

				var isOwner = false
				if(request.session.accountUsername == challenge.accountUsername){
					isOwner = true
				}

				const model = {
					challengeId: challengeId,
					isOwner: isOwner
				}

				response.render('challenge-delete.hbs', model)
			}
			
		})
	})

	router.post('/:challengeId/delete', function(request, response){
		const challengeId = request.params.challengeId
		
		challengeManager.deleteChallengeById(challengeId, function(errorCodes, results){
			if(errorCodes.length > 0){
				response.render("internal-server-error.hbs")
			}else {
				const username = request.session.accountUsername
				response.redirect('/accounts/' + username)
			}
		})
	})

	router.get('/:challengeId/update', function(request, response){
		const challengeId = request.params.challengeId
		challengeManager.getChallengeById(challengeId, function(errorCodes, challenge){
			if(errorCodes.length > 0){
				if(errorCodes.includes("challengeNotExist")){
					response.render('page-not-found.hbs')
				}else {
					response.render('internal-server-error.hbs')
				}	
			} else {

				var isOwner = false
				if(request.session.accountUsername == challenge.accountUsername){
					isOwner = true
				}

				const model = {
					progLanguages: validationVariabels.ALL_PROG_LANGUAGES,
					difficulties: validationVariabels.ALL_DIFFICULTIES,
					challenge: challenge,
					isOwner: isOwner
				}
				response.render('challenge-update.hbs', model)
			}
		})
	})

	router.post('/:challengeId/update', function(request, response){
		const challengeId = request.params.challengeId
		const sessionUsername = request.session.accountUsername
		
		const updatedChallenge = {
			id: request.params.challengeId,
			title: request.body.title,
			challengeText: request.body.challengeText,
			solutionText: request.body.solutionText,
			progLanguage: request.body.progLanguage,
			difficulty: request.body.difficulty,
			description: request.body.description,
			accountUsername: request.body.accountUsername
		}

		if(sessionUsername != updatedChallenge.accountUsername){
			const isLoggedIn = false
			const model = {
				isLoggedIn: isLoggedIn
			}
			response.render('challenge-update.hbs', model)
		}

		challengeManager.updateChallengeById(challengeId, updatedChallenge, function(errorCodes){
			if(errorCodes.length > 0){
				const model = {
					errors: errorCodes,
					challenge: updatedChallenge,
					challengeId: challengeId,
					progLanguages: validationVariabels.ALL_PROG_LANGUAGES,
					difficulties: validationVariabels.ALL_DIFFICULTIES
				}
				response.render('challenge-update.hbs', model)
			}else {
				response.redirect('/challenges/'+challengeId+'/preview')
			}
		})
	})

	return router
}



