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
				const model = {
					errors: errors,
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
			const model = {
				errors: errors,
				challenges: challenges
			}
			response.render("challenge-list.hbs", model)
		})
	})
	
	router.get("/:challengeId/preview", function(request,response){
	
		const challengeId = request.params.challengeId
		
		let allErrors = [] // This is maybe unnecessary because there is a posibility that there will be two databaseError:s
	
		challengeManager.getChallengeById(challengeId, function(errors, challenge){
			allErrors.push(...errors)
			commentManager.getCommentsByChallengeId(challengeId, function(errors, comments){
				allErrors.push(...errors)
	
				const model = {
					errors: allErrors,
					challenge: challenge,
					comments: comments
				}
				response.render("challenge-preview.hbs", model)
			})
		})
	})
	
	router.get('/:challengeId/play', function(request, response){
		const challengeId = request.params.challengeId
	
		challengeManager.getChallengeById(challengeId, function(errors, challenge){
	
			const model = {
				errors: errors,
				challenge: challenge
			}
			response.render("challenge-play.hbs", model)
		})
		
	})
	
	router.post('/:challengeId/play', function(request, response){
		const challengeId = request.params.challengeId
		const changedChallengeText = request.body.challengeText
	
		challengeManager.getResultsFromChallengeTextWithId(
			challengeId, 
			changedChallengeText, 
			function(errors, numOfRightAnswers, totalNumOfAnswers, challenge){
			
				if(errors.length > 0){
		
					challenge.challengeText = changedChallengeText
		
					const model = {
						errors: errors,
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
			}
		)
	})

	return router
}



