const express = require('express')
const jwt = require('jsonwebtoken')

const secret = 'adhfjhbreoiwevbisdvcbrejksiuf' //global???

const invalidClientError = {
    error: "invalid_client"
}

module.exports = function({accountManager, challengeManager}){

    const router = express.Router()

    router.use(express.json())
    router.use(express.urlencoded({
        extended: false
    }))

    router.use(function(request, response, next) {
        console.log(request.method, request.url)

        response.setHeader("Access-Control-Allow-Origin", "*")
	    response.setHeader("Access-Control-Allow-Methods", "*")
	    response.setHeader("Access-Control-Allow-Headers", "*")
	    response.setHeader("Access-Control-Expose-Headers", "*")
        next()
    })

    router.get("/challenges", function(request, response){

        const authHeader = request.header("Authorization")

        if(authHeader){
            const accessToken = authHeader.substring("Bearer ".length)

            jwt.verify(accessToken, secret, function(error, payload){
                if(error){
                    response.status(401).json(invalidClientError)
                }
                else{
                    challengeManager.getAllChallenges(function(errors, challenges){     
                        if(errors.length == 0){
                            response.status(200).json(challenges)
                        }
                        else{
                            response.status(500).json(errors)
                        }
                    })
                }
            })
        }
        else{
            response.status(401).json(invalidClientError)
        }
        
        
    })

    router.get("/challenges/:challengeId", function(request, response){

        const authHeader = request.header("Authorization")

        if(authHeader){
            const accessToken = authHeader.substring("Bearer ".length)

            jwt.verify(accessToken, secret, function(error, payload){
                if(error){
                    response.status(401).json(invalidClientError)
                }
                else{
                    const challengeId = request.params.challengeId

                    challengeManager.getChallengeById(challengeId, function(errors, challenge){ //Errors or error?

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
                }
            })
        }
        else{
            response.status(401).json(invalidClientError)
        }
        

        
    })

    router.post("/challenges/:challengeId/delete", function(request, response){
        const authHeader = request.header("Authorization")

        if(authHeader){
            const accessToken = authHeader.substring("Bearer ".length)

            jwt.verify(accessToken, secret, function(error, payload){
                if(error){
                    response.status(401).json(invalidClientError)
                }
                else{
    
                    challengeId = request.params.challengeId
    
                    challengeManager.deleteChallengeById(challengeId, function(errors, results){
                        if(results){
                            response.status(204).end()
                        }
                        else if(errors.length > 0){
                            response.status(500).json(errors)
                        }
                        else{
                            response.status(404).end()
                        }
    
                    })
                }
            })
        }
        else{
            response.status(401).json(invalidClientError)
        }
        

        
    })

    router.post("/challenges/:challengeId/update", function(request, response){
        const authHeader = request.header("Authorization")

        if(authHeader){
            const accessToken = authHeader.substring("Bearer ".length)

            jwt.verify(accessToken, secret, function(error, payload){
                if(error){
                    response.status(401).json(invalidClientError)
                }
                else{
                    const challengeId = request.params.challengeId

                    const updatedChallenge = {
                        title: request.body.title,
                        challengeText: request.body.challengeText,
                        solutionText: request.body.solutionText,
                        progLanguage: request.body.progLanguage,
                        difficulty: request.body.difficulty,
                        description: request.body.description
                    }
        
                    challengeManager.updateChallengeById(challengeId, updatedChallenge, function(errors, results){ //results or challenge??
                        if(errors == 0){
                            response.status(200).json(results) // This should maybe redirect and to the challenge in question
                        }
                        else if(errors.includes("databaseError")){ //Hardcoded???
                            response.status(500).json(errors)
                        }
                        else{
                            response.status(400).json(errors)
                        }
                        
                    })

                }
            })

        }
        else{
            response.status(401).json(invalidClientError)
        }
    })

    router.post("/challenges", function(request, response){

        const authHeader = request.header("Authorization")

        if(authHeader){
            const accessToken = authHeader.substring("Bearer ".length)

            jwt.verify(accessToken, secret, function(error, payload){
                if(error){
                    response.status(401).json(invalidClientError)
                }
                else{
                    const challenge = {
                        title: request.body.title,
                        challengeText: request.body.challengeText,
                        solutionText: request.body.solutionText,
                        progLanguage: request.body.progLanguage,
                        difficulty: request.body.difficulty,
                        description: request.body.description,
                        datePublished: challengeManager.getTodaysDate(),
                        numOfPlays: 0,
                        accountUsername: payload.accountUsername // Should get the userId of the account that created this challenge
                    }
            
                    challengeManager.createChallenge(challenge, function(errors, id){ //Validate account that created the challenge
                        if(errors.length == 0){
                            response.setHeader("Location", "/challenges/" + id)
                            response.status(201).json(challenge)
                        }
                        else if(errors.includes("databaseError")){ //Hardcoded???
                            response.status(500).json(errors)
                        }
                        else{
                            response.status(400).json(errors)
                        }
                    })
                }
            })
        }
        else{
            response.status(401).json(invalidClientError)
        }
        
        
    })

    router.post("/accounts", function(request, response){
        const accountInformation = {
			username: request.body.username,
			password: request.body.password,
			password2: request.body.password2
		}

        accountManager.createAccount(accountInformation, function(errors, account){
            if(errors.length == 0){
                response.setHeader("Location", "/accounts/" + account.username)
                response.status(201).json(accountInformation) // Returns hashed password, it probably should not
            }
            else{
                response.status(400).json(errors)
            }
        })
    }) 

    router.post("/tokens", function(request, response){
        const grant_type = request.body.grant_type // Should have the value "password", otherwise bad request

        if(grant_type == "password"){

            const accountCredentials = {
                username: request.body.username,
                password: request.body.password
            }

            accountManager.login(accountCredentials, function(errors, account){
                if(errors.length == 0){

                    console.log(account)

                    const payload = {
                        isLoggedIn: true, 
                        accountUsername: account.username
                    }
        
                    jwt.sign(payload, secret, function(error, token){
                        if(error){
                            console.log(error)
                            response.status(401).json(invalidClientError)
                        }
                        else{
                            response.status(200).json({
                                "access_token": token
                            })
                        }                        
                    })
                }
                else{
                    response.status(401).json(errors)
                }
                
            })
        }
        else{
            response.status(400).json({error: "unsupported_grant_type"})
        }
    })

    router.get("/coffee", function(request, response){ // MAKE SURE THIS DOES NOT MESS ANYTHING UP! :)
        response.status(418).json("The server refuses to brew coffee because it is, permanently, a teapot.")
    })


    return router
}