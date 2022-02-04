const express = require('express')
const challengeManager = require('../../business-logic-layer/challenge-manager')

const router = express.Router()

router.get("/create", function(request, response){
	response.render("challenge-create.hbs")
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

router.get("/:id/preview", function(request,response){ //change this when database is added so it takes challenge id in url and sends information in model.

    const id = request.params.id
	
	challengeManager.getChallengeById(id, function(errors, challenge){
		const model = {
			errors: errors,
			challenge: challenge
		}
		response.render("challenge-preview.hbs", model)
	})
})


module.exports = router
