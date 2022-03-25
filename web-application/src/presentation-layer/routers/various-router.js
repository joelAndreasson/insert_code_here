const express = require('express')

module.exports = function({challengeManager}){
	const router = express.Router()

	router.get("/", function(request, response){
		challengeManager.getTopThreePlayedChallenge(function(errorCodes, challenges){
			if(errorCodes.length > 0){
				response.render("internal-server-error.hbs")
			}else {
				const model = {
					challenges: challenges
				}
				response.render("home.hbs", model)
			}
		})
	})

	router.get("/about", function(request, response){
		response.render("about.hbs")
	})

	router.get("/contact", function(request, response){
		response.render("contact.hbs")
	})

	return router
}

