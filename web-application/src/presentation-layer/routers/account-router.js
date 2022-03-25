const express = require('express')

module.exports = function({accountManager, challengeManager, errorTranslator}){
	const router = express.Router()

	router.get("/sign-out", function(request, response){
		request.session.destroy(function(error){
			if(error){
				response.render("internal-server-error.hbs")
			}else{
				response.redirect("/")
			}
		})
	})

	router.get("/sign-up", function(request, response){
		response.render("accounts-sign-up.hbs")
	})

	router.get("/login", function(request, response){
		response.render("accounts-sign-in.hbs")
	})

	router.get("/", function(request, response){
		accountManager.getAllAccounts(function(errors, accounts){
			if(errors.length > 0){
				response.render("internal-server-error.hbs")
			}else {
				const model = {
					errors: errors,
					accounts: accounts
				}
				response.render("accounts-list-all.hbs", model)
			}
		})
	})

	router.get("/:accountUsername", function(request,response){
		const accountUsername = request.params.accountUsername

		accountManager.getAccountByUsername(accountUsername, function(errors, account){
			if(errors.length > 0){
				response.render("internal-server-error.hbs")
			}else if(account == undefined){
				response.render("page-not-found.hbs")
			}else{
				challengeManager.getChallengesByUsername(accountUsername, function(errors, challenges){
					if(errors.length > 0){
						response.render("internal-server-error.hbs")
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
				response.render("internal-server-error.hbs")
			}else if(account == undefined){
				response.render("page-not-found.hbs")
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
		accountManager.updateAccountBio(newBioText, accountUsername, function(errors, results){
			if(errors.length > 0){
				const errorCodes = errorTranslator.translateErrorCodes(errors)
				const model = {
					errors: errorCodes
				}
				response.render("profile-edit-bio.hbs", model)
			}else {
				response.redirect("/accounts/"+accountUsername)
			}
		})
	})

	router.post("/login", function(request, response){
		const accountCredentials = {
			username: request.body.username,
			password: request.body.password
		}

		accountManager.login(accountCredentials, function(errors, account){
			if(errors.length > 0){ // if there are errors
				const errorCodes = errorTranslator.translateErrorCodes(errors)
				const model = {
					errors: errorCodes
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
				const errorCodes = errorTranslator.translateErrorCodes(errors)
				const model = {
					errors: errorCodes,
					accountInformation: accountInformation
				}
				response.render("accounts-sign-up.hbs", model)
			}else{
				request.session.isLoggedIn = true
				request.session.accountUsername = accountInformation.username
				response.redirect("/accounts/" + accountInformation.username) // change this at later date (maybe login the user with the account that they created and render their profile?)
			}
		})
	})

	return router
}

