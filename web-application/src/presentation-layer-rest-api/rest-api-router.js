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

        challengeManager.getAllChallenges(function(errorCodes, challenges){     
            if(errorCodes.length == 0){
                response.status(200).json(challenges)
            }
            else{
                response.status(500).json(errorCodes)
            }
        })
    })

    router.get("/challenges/:challengeId", function(request, response){
    
        const challengeId = request.params.challengeId

        challengeManager.getChallengeById(challengeId, function(errorCodes, challenge){

            if(challenge){
                response.status(200).json(challenge)
            }
            else if(errorCodes.length > 0){
                response.status(500).json(errorCodes)
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
            function(errorCodes, numOfRightAnswers, totalNumOfAnswers, challenge){

                if(errorCodes.length == 0){
                    const model = {
                        numOfRightAnswers: numOfRightAnswers,
                        totalNumOfAnswers: totalNumOfAnswers
                    }

                    response.status(200).json(model)
                }
                else if(errorCodes.includes(databaseError)){
                    response.status(500).json(errorCodes)
                }
                else{
                    response.status(400).json(errorCodes)
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

                    challengeManager.getChallengeById(challengeId, function(errorCodes, challenge){

                        if(errorCodes.length > 0){
                            response.status(500).json(errorCodes)
                        }
                        else if(payload.accountUsername != challenge.accountUsername){
                            response.status(401).json(invalidClientError)
                        }
                        else{
                            challengeManager.deleteChallengeById(challengeId, function(errorCodes, results){
                                if(results){
                                    response.status(204).end()
                                }
                                else if(errorCodes.length > 0){
                                    response.status(500).json(errorCodes)
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

                    challengeManager.getChallengeById(challengeId, function(errorCodes, challenge){

                        if(errorCodes.length > 0){
                            response.status(500).json(errorCodes)
                        }
                        else if(payload.accountUsername != challenge.accountUsername){
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
                
                            challengeManager.updateChallengeById(challengeId, updatedChallenge, function(errorCodes, results){
                                if(errorCodes == 0){
                                    response.status(204).end()
                                }
                                else if(errorCodes.includes(databaseError)){
                                    response.status(500).json(errorCodes)
                                }
                                else{
                                    response.status(400).json(errorCodes)
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
            
                    challengeManager.createChallenge(challenge, function(errorCodes, challengeId){
                        if(errorCodes.length == 0){
                            response.setHeader("Location", "/challenges/" + challengeId)
                            response.status(201).json(challengeId)
                        }
                        else if(errorCodes.includes(databaseError)){
                            response.status(500).json(errorCodes)
                        }
                        else{
                            response.status(400).json(errorCodes)
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

        accountManager.createAccount(accountInformation, function(errorCodes, results){
            if(errorCodes.length == 0){
                const account = {
                    username: accountInformation.username,
                    password: accountInformation.password2
                }

                response.setHeader("Location", "/accounts/" + account.username)
                response.status(201).json(account)
            }
            else if(errorCodes.includes(databaseError)){
                response.status(500).json(errorCodes)
            }
            else{
                response.status(400).json(errorCodes)
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

            accountManager.login(accountCredentials, function(errorCodes, account){
                if(errorCodes.length == 0){

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
                else if(errorCodes.includes(databaseError)){
                    response.status(500).json(errorCodes)
                }
                else{
                    response.status(401).json(errorCodes)
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