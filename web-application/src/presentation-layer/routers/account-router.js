const express = require('express')

module.exports = function({accountManager}){
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

	router.get("/profile", function(request,response){
		console.log("account id: " + request.session.accountId)
		accountManager.getAccountById(request.session.accountId, function(error, account){
			console.log("account: " + account)
			if(error.length > 0){
				console.log("there was a database error when fetching account by id.")
				// handle this error better by adding a internal server error page.
			}else{
				const model = {
					account: account
				}
				response.render("profile.hbs", model)
			}
		})
	})

	router.get("/profileEditBio", function(request, response){
		console.log("GET: editProfileBio")
		accountManager.getAccountById(request.session.accountId, function(error, account){
			if(error.length > 0){
				// handle this error better by adding a internal server error page.
				console.log("there was a database error when fetching account by id.")
			}else {
				const model = {
					account: account
				}
				response.render("profile-edit-bio.hbs", model)
			}
		})
	})

	router.post("/profileEditBio", function(request,response){
		const newBioText = request.body.bioText
		const accountId = request.session.accountId
		accountManager.editAccountBio(newBioText, accountId, function(error, results){
			if(error.length > 0){
				// handle this error better by adding a internal server error page.
				console.log("there was a database error when editing the users bio")
			}else {
				response.redirect("/accounts/profile")
			}
		})
	})

	router.get('/:username', function(request, response){
		console.log("GET: Username")
		const username = request.params.username
		
		accountManager.getAccountByUsername(username, function(errors, account){
			const model = {
				errors: errors,
				account: account
			}
			response.render("accounts-show-one.hbs", model)
		})
		
	})

	router.post("/login", function(request, response){ // change to get?
		const accountCredentials = {
			username: request.body.username,
			password: request.body.password
		}

		accountManager.login(accountCredentials, function(errors, account){
			console.log("error log: "+errors)
			console.log("account log: "+account)
			if(errors.length > 0){ // if there are errors
				const model = {
					errors: errors
				}
				response.render("accounts-sign-in.hbs", model)
			}else{ // no errors, login
				request.session.isLoggedIn = true
				request.session.accountId = account.id
				response.redirect("/")
			}
		})
	})

	router.post("/create", function(request,response){
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

	return router
}

