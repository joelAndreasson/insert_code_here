const express = require('express')
const challengeManager = require('../../business-logic-layer/challenge-manager')

const router = express.Router()

router.get("/create", function(request, response){
	response.render("create-challenge.hbs")
})

router.get("/", function(request, response){

    challengeManager.getAllChallenges(function(errors, challenges){
		const model = {
			errors: errors,
			challenges: challenges
		}
		response.render("challenges-list.hbs", model)
	})
})

router.get("/:id", function(request,response){ //change this when database is added so it takes challenge id in url and sends information in model.

    const id = request.params.id
	
	challengeManager.getChallengeById(id, function(errors, challenge){
		const model = {
			errors: errors,
			challenge: challenge
		}
		response.render("view-challenge.hbs", model)
	})
})


module.exports = router
