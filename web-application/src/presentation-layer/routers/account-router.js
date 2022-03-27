const express = require('express')

module.exports = function({accountManager, challengeManager, errorTranslator}){
	const router = express.Router()

	router.get("/sign-out", function(request, response){
		request.session.destroy(function(error){
			if(error != null){
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
		accountManager.getAllAccounts(function(errorCodes, accounts){
			if(errorCodes.length > 0){
				response.render("internal-server-error.hbs")
			}else {
				const model = {
					errors: errorCodes,
					accounts: accounts
				}
				response.render("accounts-list-all.hbs", model)
			}
		})
	})

	router.get("/:accountUsername", function(request,response){
		const accountUsername = request.params.accountUsername

		accountManager.getAccountByUsername(accountUsername, function(errorCodes, account){
			if(errorCodes.length > 0){
				if(errorCodes.includes("accountNotExist")){
					response.render("page-not-found.hbs")
				}else {
					response.render("internal-server-error.hbs")
				}
			}else{
				challengeManager.getChallengesByUsername(accountUsername, function(errorCodes, challenges){
					if(errorCodes.length > 0){
						response.render("internal-server-error.hbs")
					}else {
						let isProfileOwner = false
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

	router.get("/:accountUsername/updateBio", function(request, response){
		const accountUsername = request.params.accountUsername
		accountManager.getAccountByUsername(accountUsername, function(errorCodes, account){
			if(errorCodes.length > 0){
				if(errorCodes.includes("accountNotExist")){
					response.render("page-not-found.hbs")
				}else {
					response.render("internal-server-error.hbs")
				}
			}else {
				const model = {
					account: account
				}
				response.render("profile-edit-bio.hbs", model)
			}
		})
	})

	router.post("/:accountUsername/updateBio", function(request,response){
		const newBioText = request.body.bioText
		const profileAccountUsername = request.params.accountUsername

		const requesterUsername = request.session.accountUsername
		accountManager.updateAccountBio(
			requesterUsername, 
			newBioText, 
			profileAccountUsername, 
			function(errorCodes, results){
				if(errorCodes.length > 0){
					const translatedErrorCodes = errorTranslator.translateErrorCodes(errorCodes)
					const model = {
						errors: translatedErrorCodes,
						account: {
							username: profileAccountUsername,
							bio: newBioText
						}
					}
					response.render("profile-edit-bio.hbs", model)
				}else {
					response.redirect("/accounts/"+profileAccountUsername)
				}
			}
		)
		
		
	})

	router.post("/login", function(request, response){
		const accountCredentials = {
			username: request.body.username,
			password: request.body.password
		}

		accountManager.login(accountCredentials, function(errorCodes, account){
			if(errorCodes.length > 0){
				const translatedErrors = errorTranslator.translateErrorCodes(errorCodes)
				const model = {
					errors: translatedErrors
				}
				response.render("accounts-sign-in.hbs", model)
			}else{ 
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
		
		accountManager.createAccount(accountInformation, function(errorCodes, account){
			if(errorCodes.length > 0){
				const translatedErrors = errorTranslator.translateErrorCodes(errorCodes)
				const model = {
					errors: translatedErrors,
					accountInformation: accountInformation
				}
				response.render("accounts-sign-up.hbs", model)
			}else{
				request.session.isLoggedIn = true
				request.session.accountUsername = accountInformation.username
				response.redirect("/accounts/" + accountInformation.username)
			}
		})
	})

	return router
}

