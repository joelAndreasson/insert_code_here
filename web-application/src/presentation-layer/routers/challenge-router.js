const express = require('express')

module.exports = function({challengeManager, commentManager, validationVariabels}){
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
		
		challengeManager.createChallenge(challenge, function(errors, id){
			
			if(errors.length > 0){
				const errorCodes = errorTranslator.translateErrorCodes(errors)
				const model = {
					errors: errorCodes,
					challenge: challenge,
					progLanguages: validationVariabels.ALL_PROG_LANGUAGES,
					difficulties: validationVariabels.ALL_DIFFICULTIES
				}
				response.render('challenge-create.hbs', model)
			}
			else{
				response.redirect('/challenges/' + id + '/preview')
			}
	
			
		})
	
	})
	
	router.get("/", function(request, response){
	
		challengeManager.getAllChallenges(function(errors, challenges){
			if(errors.length > 0){
				response.render("internal-server-error.hbs")
			}else {
				const model = {
					challenges: challenges
				}
				response.render("challenge-list.hbs", model)
			}
		})
	})
	
	router.get("/:id/preview", function(request,response){ // id should mabye be challengeId instead?
	
		const id = request.params.id // id should mabye be challengeId instead?
		
		let allErrors = []
	
		challengeManager.getChallengeById(id, function(errors, challenge){
			allErrors.push(...errors)
			if(challenge == undefined){
				response.render("page-not-found.hbs")
			}
			commentManager.getCommentsByChallengeId(id, function(errors, comments){
				allErrors.push(...errors)
				if(allErrors.length > 0){
					response.render("internal-server-error.hbs")
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
	
	router.get('/:id/play', function(request, response){
		const id = request.params.id
	
		challengeManager.getChallengeById(id, function(errors, challenge){
			if(errors.length > 0){
				response.render("internal-server-error.hbs")
			}else if(challenge == undefined){
				response.render("page-not-found.hbs")
			}else {
				const model = {
					challenge: challenge
				}
				response.render("challenge-play.hbs", model)
			}
		})
		
	})
	
	router.post('/:id/play', function(request, response){
		const id = request.params.id
		const changedChallengeText = request.body.challengeText
	
		challengeManager.getResultsFromChallengeTextWithId(id, changedChallengeText, function(errors, numOfRightAnswers, totalNumOfAnswers, challenge){
			
			if(errors.length > 0){
	
				challenge.challengeText = changedChallengeText
				
				const errorCodes = errorTranslator.translateErrorCodes(errors)
				const model = {
					errors: errorCodes,
					challenge: challenge
				}
	
				response.render('challenge-play.hbs', model)
			}
			else{
				const model = {
					numOfRightAnswers: numOfRightAnswers,
					totalNumOfAnswers: totalNumOfAnswers
				}
			
				response.render('challenge-completed.hbs', model) // POST request should maybe redirect instead? How?
			}
		})
	})

	return router
}



