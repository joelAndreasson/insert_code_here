const express = require('express')
const challengeManager = require('../../business-logic-layer/challenge-manager')

const router = express.Router()

router.get("/create", function(request, response){
	response.render("create-challenge.hbs")
})

router.get("/", function(request, response){
	response.render("challenges-list.hbs") // add databse information 
})

router.get("/view", function(request,response){ //change this when database is added so it takes challenge id in url and sends information in model.
	response.render("view-challenge.hbs")
})


module.exports = router
