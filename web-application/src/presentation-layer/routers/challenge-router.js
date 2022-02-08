const express = require('express')
const challengeManager = require('../../business-logic-layer/challenge-manager')

const router = express.Router()

function getTodaysDate(){
	const today = new Date()

	const yyyy = today.getFullYear()

	let mm = today.getMonth()
	mm = mm < 10 ? "0" + mm : mm;

	let dd = today.getDay()
	dd = dd < 10 ? "0" + dd : dd;

	return yyyy + "-" + mm + "-" + dd
}

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
	const progLanguage = request.body.progLanguage
	const difficulty = request.body.difficulty
	const description = request.body.description
	const datePublished = getTodaysDate()
	const numOfPlays = 0
	const userId = 1 // Should get the userId of the account that crated this challenge

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
