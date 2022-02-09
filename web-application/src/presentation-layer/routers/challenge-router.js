const express = require('express')
const challengeManager = require('../../business-logic-layer/challenge-manager')

const router = express.Router()



router.get("/create", function(request, response){
	response.render("challenge-create.hbs")
})

router.post('/create', function(request, response){
	const title = request.body.title
	const challengeText = request.body.challengeText
	const progLanguage = request.body.progLanguage
	const difficulty = request.body.difficulty
	const description = request.body.description
	const datePublished = challengeManager.getTodaysDate()
	const numOfPlays = 0
	const userId = 1 // Should get the userId of the account that created this challenge

	const challenge = new challengeManager.Challenge(title, challengeText, progLanguage, difficulty, description, datePublished, numOfPlays, userId)

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
	
	challengeManager.getChallengeById(id, function(errors, challenge){
		const model = {
			errors: errors,
			challenge: challenge
		}
		response.render("challenge-preview.hbs", model)
	})
})

router.get('/:id/play', function(request, response){
	const id = request.params.id

	challengeManager.getChallengeById(id, function(errors, challenge){

		const re = /INSERT[\d]/g
		regexArray = challenge.challengeText.match(re) // REGEX NOT FINISHED

		console.log(regexArray)
		challenge.challengeText = challenge.challengeText.replace(re, "HEJ")

		const model = {
			errors: errors,
			challenge: challenge
		}
		response.render("challenge-play.hbs", model)
	})
	
})


module.exports = router
