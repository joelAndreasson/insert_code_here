const express = require('express')
const jwt = require('jsonwebtoken')

const secret = 'adhfjhbreoiwevbisdvcbrejksiuf' //global???

module.exports = function({accountManager, challengeManager}){

    const router = express.Router()

    router.use(express.json())
    router.use(express.urlencoded({
        extended: false
    }))

    router.use(function(request, response, next) {
        console.log(request.method, request.url)
        next()
    })

    router.get("/challenges", function(request, response){

        const authHeader = request.header("Authorization")
        const accessToken = authHeader.substring("Bearer ".length)

        jwt.verify(accessToken, secret, function(error, payload){
            if(error){
                response.status(401).end()
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
        
    })

    router.get("/challenges/:id", function(request, response){

        const authHeader = request.header("Authorization")
        const accessToken = authHeader.substring("Bearer ".length)

        jwt.verify(accessToken, secret, function(error, payload){
            if(error){
                response.status(401).end()
            }
            else{
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
            }
        })

        
    })

    router.post("/challenges", function(request, response){

        const authHeader = request.header("Authorization")
        const accessToken = authHeader.substring("Bearer ".length)

        jwt.verify(accessToken, secret, function(error, payload){
            if(error){
                response.status(401).end()
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
                    else{
                        response.status(400).json(errors) // Might be 500 if databaseError ocurrs?
                    }
                })
            }
        })
        
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
                            response.status(401).json(error)
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


    return router
}