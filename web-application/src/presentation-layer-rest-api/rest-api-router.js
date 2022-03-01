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


    return router
}