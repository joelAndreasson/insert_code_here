const express = require('express')
const challengeManager = require('../../business-logic-layer/challenge-manager')

const router = express.Router()



class Challenge{ // Should probably be put elsewhere
	constructor(title, challengeText, progLanguage, difficulty, description, datePublished, numOfPlays, userId){
		this.title = title
		this.challengeText = challengeText
		this.progLanguage = progLanguage
		this.difficulty = difficulty
		this.description = description
		this.datePublished = datePublished
		this.numOfPlays = numOfPlays
		this.userId = userId
	}
}

router.get("/create", function(request, response){
	response.render("challenge-create.hbs")
})

router.post('/create', function(request, response){
	const title = request.body.title
	const challengeText = request.body.challengeText
	const progLanguage = "JavaScript" // Hardcoded dummy values
	const difficulty = "Medium"
	const description = request.body.description
	const datePublished = "2022-02-05"
	const numOfPlays = 0
	const userId = 1

	const challenge = new Challenge(title, challengeText, progLanguage, difficulty, description, datePublished, numOfPlays, userId)

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
		const model = {
			errors: errors,
			challenge: challenge
		}
		response.render("challenge-play.hbs", model)
	})
	
})


module.exports = router
