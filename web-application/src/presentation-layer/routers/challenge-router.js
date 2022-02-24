const express = require('express')

module.exports = function({challengeManager, commentManager}){
	const router = express.Router()

	router.get("/create", function(request, response){
		response.render("challenge-create.hbs")
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
			userId: 1 // Should get the userId of the account that created this challenge
		}
	
		
		challengeManager.createChallenge(challenge, function(errors, id){
	
			if(errors.length > 0){
				const model = {
					errors: errors,
					challenge: challenge
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
	
	router.get("/:id/preview", function(request,response){ // id should mabye be challengeId instead?
	
		const id = request.params.id // id should mabye be challengeId instead?
		
		let allErrors = []
	
		challengeManager.getChallengeById(id, function(errors, challenge){
			allErrors.push(...errors)
			commentManager.getCommentsByChallengeId(id, function(errors, comments){
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
	
	router.get('/:id/play', function(request, response){
		const id = request.params.id
	
		challengeManager.getChallengeById(id, function(errors, challenge){
	
			const model = {
				errors: errors,
				challenge: challenge
			}
			response.render("challenge-play.hbs", model)
		})
		
	})
	
	router.post('/:id/play', function(request, response){
		const id = request.params.id
		const changedChallengeText = request.body.challengeText
	
		challengeManager.getResultsFromChallengeTextWithId(id, changedChallengeText, function(errors, numOfRightAnswers, totalNumOfAnswers, challenge){
			
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
		})
	})

	return router
}



