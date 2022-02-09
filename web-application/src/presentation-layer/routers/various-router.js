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

router.get("/profile", function(request,response){
	response.render("profile.hbs") // add databse information 
})

module.exports = router