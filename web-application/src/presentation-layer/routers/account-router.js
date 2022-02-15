const express = require('express')
const accountManager = require('../../business-logic-layer/account-manager')


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
	const accountInformation = {
		username: request.body.username,
		password: request.body.password
	}

	accountManager.getAccountByUsername(accountInformation.username, function(errors, account){
		if(errors.length > 0){
			const model = {
				errors: errors
			}
			response.render("accounts-sign-in.hbs", model)
		}else{
			if(accountInformation.password == account.password){
				request.session.isLoggedIn = true
				response.redirect("/")
			}else{
				const model = {
					error: "Could not sign in, please enter account credentials again."
				}
				response.render("accounts-sign-in.hbs", model)
			}
		}
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
			response.render("profile.hbs", model)
		}
	})
})

module.exports = router