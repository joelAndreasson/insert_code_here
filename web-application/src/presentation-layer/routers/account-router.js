const express = require('express')

module.exports = function({accountManager, challengeManager}){
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

	router.get("/sign-in", function(request, response){ // change to login later 
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

	router.get("/:accountUsername", function(request,response){
		const accountUsername = request.params.accountUsername

		accountManager.getAccountByUsername(accountUsername, function(error, account){
			if(error.length > 0){
				console.log("there was a database error when fetching account by id.")
				// handle this error better by adding a internal server error page.
			}else{
				challengeManager.getChallengesByUsername(accountUsername, function(error, challenges){
					if(error.length > 0){
						// handle errors
						console.log("there was an error when fetching challenges for users profile.")
					}else {
						var isProfileOwner = false
						if(request.session.accountUsername == account.username){
							isProfileOwner = true
						}
						const model = {
							account: account,
							isProfileOwner: isProfileOwner,
							challenges: challenges
						}
						response.render("profile.hbs", model)
					}
				})
			}
		})
	})

	router.get("/:username/updateBio", function(request, response){
		accountManager.getAccountByUsername(request.session.accountUsername, function(error, account){
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

	router.post("/:username/updateBio", function(request,response){
		const newBioText = request.body.bioText
		const accountUsername = request.params.username
		accountManager.updateAccountBio(newBioText, accountUsername, function(error, results){
			if(error.length > 0){
				// handle this error better by adding a internal server error page.
				console.log("there was a database error when editing the users bio")
			}else {
				response.redirect("/accounts/"+accountUsername)
			}
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

	router.post("/login", function(request, response){ // change to get?
		const accountCredentials = {
			username: request.body.username,
			password: request.body.password
		}

		accountManager.login(accountCredentials, function(errors, account){
			if(errors.length > 0){ // if there are errors
				const model = {
					errors: errors
				}
				response.render("accounts-sign-in.hbs", model)
			}else{ // no errors, login
				request.session.isLoggedIn = true
				request.session.accountUsername = account.username
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
		accountManager.createAccount(accountInformation, function(errors, account){
			if(errors.length > 0){
				const model = {
					errors: errors,
					accountInformation: accountInformation // ??? should it not be: "accountInformation: accountInformation" instead???
				}
				response.render("accounts-sign-up.hbs", model)
			}else{
				const model = {
					errors: errors,
					account: account
				}
				response.render("profile.hbs", model) // change this at later date (maybe login the user with the account that they created and render their profile?)
			}
		})
	})

	return router
}

