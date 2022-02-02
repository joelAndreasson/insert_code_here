const express = require('express')

const router = express.Router()

router.get("/", function(request, response){
	response.render("home.hbs")
})

router.get("/about", function(request, response){
	response.render("about.hbs")
})

router.get("/contact", function(request, response){
	response.render("contact.hbs")
})

router.get("/createChallange", function(request, response){
	response.render("create-challange.hbs")
})

router.get("/challangesList", function(request, response){
	response.render("challanges-list.hbs") // add databse information 
})

router.get("/viewChallange", function(request,response){ //change this when database is added so it takes challenge id in url and sends information in model.
	response.render("view-challange.hbs")
})

router.get("/profile", function(request,response){
	response.render("profile.hbs") // add databse information 
})

module.exports = router