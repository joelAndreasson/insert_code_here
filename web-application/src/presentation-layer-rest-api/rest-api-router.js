const express = require('express')



module.exports = function({accountManager, challengeManager, commentManager}){

    const router = express.Router()

    router.use(express.json())

    router.use((request, response, next) => { //Should we use lambda functions like this instead?
        console.log(request.method, request.url)
        next()
    })

    router.get("/challenges", function(request, response){
        challengeManager.getAllChallenges(function(errors, challenges){
            if(errors.length == 0){
                response.status(200).json(challenges)
            }
            else{
                response.status(500).json(errors)
            }
		})
    })

    router.get("/challenges/:id", function(request, response){

        const id = request.params.id

        challengeManager.getChallengeById(id, function(errors, challenge){

            if(challenge){
                response.status(200).json(challenge)
            }
            else if(errors.length > 0){
                response.status(500).json(errors)
            }
            else{
                response.status(404).end()
            }
        })
    })

    router.post("/challenges/create", function(request, response){ // "/challenges" instead of "/challenges/create" ?? but what if one wants to update, delete etc??

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

        challengeManager.createChallenge(challenge, function(errors, id){ //Validate account that created the challenge
            if(errors.length == 0){
                response.setHeader("Location", "/challenges/"+id)
                response.status(201).json(challenge)
            }
            else{
                response.status(400).json(errors) // Might be 500 if databaseError ocurrs?
            }
        })
    })


    return router
}