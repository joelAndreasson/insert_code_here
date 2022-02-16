const express = require('express')
const accountManager = require('../../business-logic-layer/account-manager')
const bcrypt = require('bcrypt')

// bcrypt variables
const saltRounds = 10


const router = express.Router()

router.get("/sign-out", function(request, response){
	request.session.destroy(function(error){
		if(error){
			// load internal server error page.
		}else{
			response.redirect("/")
		}
	})
})

router.get("/sign-up", function(request, response){
	response.render("accounts-sign-up.hbs")
})

router.get("/sign-in", function(request, response){
	response.render("accounts-sign-in.hbs")
})

router.get("/", function(request, response){
	accountManager.getAllAccounts(function(errors, accounts){
		const model = {
			errors: errors,
			accounts: accounts
		}
		response.render("accounts-list-all.hbs", model)
	})
})

router.get('/:username', function(request, response){
	const username = request.params.username
	
	accountManager.getAccountByUsername(username, function(errors, account){
		const model = {
			errors: errors,
			account: account
		}
		response.render("accounts-show-one.hbs", model)
	})
	
})

router.post("/login", function(request, response){ // check if this could be improved and move things that should be in in another layer
	const accountCredentials = {
		username: request.body.username,
		password: request.body.password
	}

	accountManager.getAccountByUsername(accountCredentials.username, function(errors, account){
		if(errors.length > 0){ // if there are errors
			console.log("database error")
			const model = {
				errors: errors
			}
			response.render("accounts-sign-in.hbs", model)
		}else{ // no errors, compare password with hashed password 
			if(account == undefined){
				const model = { // did not manage to login.
					errors: ["There is no account matching those credentials, check credentials spelling."]
				}
				response.render("accounts-sign-in.hbs", model)
			}else if(bcrypt.compareSync(accountCredentials.password, account.password)){ // managed to login
				request.session.isLoggedIn = true
				response.redirect('/')
			}else{
				const model = { // did not manage to login.
					errors: ["There is no account matching those credentials, check credentials spelling."]
				}
				response.render("accounts-sign-in.hbs", model)
			}
		} 
		console.log("i should not be here!")
	})
})

router.post("/createAccount", function(request,response){
	const accountInformation = {
		username: request.body.username,
		password: request.body.password,
		password2: request.body.password2
	}
	accountManager.createAccount(accountInformation, function(errors,account){
		if(errors.length > 0){
			const model = {
				errors: errors,
				accountInformation
			}
			response.render("accounts-sign-up.hbs", model)
		}else{
			const model = {
				errors: errors,
				account: account
			}
			response.render("profile.hbs", model) // change this at later date
		}
	})
})

module.exports = router