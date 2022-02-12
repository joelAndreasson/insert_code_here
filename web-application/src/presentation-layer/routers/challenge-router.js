const express = require('express')
const challengeManager = require('../../business-logic-layer/challenge-manager')
const commentManager = require('../../business-logic-layer/comment-manager')

const router = express.Router()



router.get("/create", function(request, response){
	response.render("challenge-create.hbs")
})

router.post('/create', function(request, response){
	const title = request.body.title
	const challengeText = request.body.challengeText
	const solutionText = request.body.solutionText
	const progLanguage = request.body.progLanguage
	const difficulty = request.body.difficulty
	const description = request.body.description
	const datePublished = challengeManager.getTodaysDate()
	const numOfPlays = 0
	const userId = 1 // Should get the userId of the account that created this challenge

	const challenge = new challengeManager.Challenge(title, challengeText, solutionText, progLanguage, difficulty, description, datePublished, numOfPlays, userId)

	challengeManager.createChallenge(challenge, function(error, id){
		// TODO: Add error handling
		response.redirect('/challenges/' + id + '/preview')
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

router.get("/:id/preview", function(request,response){ 

    const id = request.params.id
	
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

	challengeManager.getResultsFromChallengeTextWithId(id, changedChallengeText, function(errors, numOfRightAnswers, totalNumOfAnswers){
		const model = {
			numOfRightAnswers: numOfRightAnswers,
			totalNumOfAnswers: totalNumOfAnswers
		}
	
		response.render('challenge-completed.hbs', model) // POST request should maybe redirect instead? How?
	})
})


module.exports = router
