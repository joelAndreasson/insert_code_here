const express = require('express')
const jwt = require('jsonwebtoken')

const secret = 'adhfjhbreoiwevbisdvcbrejksiuf'

const invalidClientError = {
    error: "invalid_client"
}

const databaseError = "databaseError"

module.exports = function({accountManager, challengeManager, validationVariabels}){

    const router = express.Router()

    router.use(express.json())
    router.use(express.urlencoded({
        extended: false
    }))

    router.use(function(request, response, next) {
        console.log(request.method, request.url)

        response.setHeader("Access-Control-Allow-Origin", "*")
	    response.setHeader("Access-Control-Allow-Headers", "*")
        response.setHeader("Access-Control-Allow-Methods", "*")
	    response.setHeader("Access-Control-Expose-Headers", "*")

        if(request.method == "OPTIONS"){
            return response.status(200).end()
        }

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

    router.get("/challenges/:challengeId", function(request, response){
    
        const challengeId = request.params.challengeId

        challengeManager.getChallengeById(challengeId, function(errors, challenge){

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

    router.post("/challenges/:challengeId/play", function(request, response){
        const challengeId = request.params.challengeId
        const changedChallengeText = request.body.changedChallengeText

        challengeManager.getResultsFromChallengeTextWithId(
            challengeId, 
            changedChallengeText, 
            function(errors, numOfRightAnswers, totalNumOfAnswers, challenge){

                if(errors.length == 0){
                    const model = {
                        numOfRightAnswers: numOfRightAnswers,
                        totalNumOfAnswers: totalNumOfAnswers
                    }

                    response.status(200).json(model)
                }
                else if(errors.includes(databaseError)){
                    response.status(500).json(errors)
                }
                else{
                    response.status(400).json(errors)
                }

            }
        )

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
    
                    const challengeId = request.params.challengeId

                    challengeManager.getChallengeById(challengeId, function(errors, challenge){

                        if(payload.accountUsername != challenge.accountUsername){
                            response.status(401).json(invalidClientError)
                        }
                        else{
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

                    challengeManager.getChallengeById(challengeId, function(errors, challenge){

                        if(payload.accountUsername != challenge.accountUsername){
                            response.status(401).json(invalidClientError)
                        }
                        else{
                            const updatedChallenge = {
                                title: request.body.title,
                                challengeText: request.body.challengeText,
                                solutionText: request.body.solutionText,
                                progLanguage: request.body.progLanguage,
                                difficulty: request.body.difficulty,
                                description: request.body.description
                            }
                
                            challengeManager.updateChallengeById(challengeId, updatedChallenge, function(errors, results){
                                if(errors == 0){
                                    response.status(204).end()
                                }
                                else if(errors.includes(databaseError)){
                                    response.status(500).json(errors)
                                }
                                else{
                                    response.status(400).json(errors)
                                }
                                
                            })
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
                        accountUsername: request.body.accountUsername
                    }
            
                    challengeManager.createChallenge(challenge, function(errors, challengeId){
                        if(errors.length == 0){
                            response.setHeader("Location", "/challenges/" + challengeId)
                            response.status(201).json(challengeId)
                        }
                        else if(errors.includes(databaseError)){
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

        accountManager.createAccount(accountInformation, function(errors, results){
            if(errors.length == 0){
                const account = {
                    username: accountInformation.username,
                    password: accountInformation.password2
                }

                response.setHeader("Location", "/accounts/" + account.username)
                response.status(201).json(account)
            }
            else if(errors.includes(databaseError)){
                response.status(500).json(errors)
            }
            else{
                response.status(400).json(errors)
            }
        })
    }) 

    router.post("/tokens", function(request, response){
        const grant_type = request.body.grant_type

        if(grant_type == "password"){

            const accountCredentials = {
                username: request.body.username,
                password: request.body.password
            }

            accountManager.login(accountCredentials, function(errors, account){
                if(errors.length == 0){

                    const payload = {
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
                else if(errors.includes(databaseError)){
                    response.status(500).json(errors)
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

    router.get("/coffee", function(request, response){
        response.status(418).json("The server refuses to brew coffee because it is, permanently, a teapot.")
    })

    router.get("/validationVariables", function(request, response){
        response.status(200).json(validationVariabels)
    })

    return router
}