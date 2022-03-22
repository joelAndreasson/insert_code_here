
const bcrypt = require('bcrypt')
const { response } = require('express')

// brcypt variables
const saltRounds = 10 // globals?
const salt = bcrypt.genSaltSync(saltRounds);

module.exports = function({accountRepository, accountValidator}){
	return{
		getAllAccounts: function(callback){
			accountRepository.getAllAccounts(callback)
		},

		createAccount: function(accountInformation, callback){
			
			// Validate the account.
			const errors = accountValidator.getErrorsNewAccount(accountInformation)
			if(errors.length > 0){
				callback(errors, null)
				return
			}
			// hash password
			accountInformation.password = bcrypt.hashSync(accountInformation.password, salt);
			accountRepository.createAccount(accountInformation, callback)	
		},

		getAccountByUsername: function(username, callback){
			accountRepository.getAccountByUsername(username, function(errors, account){
				if(errors.length > 0){
					callback(errors, null)
				}else {
					callback(errors, account)
				}
			})
		},

		login: function(loginCredentials, callback){
			accountRepository.getAccountByUsername(loginCredentials.username, function(errors,account){
				if(errors.length > 0){
					callback(errors, null)
				}else {
					const validationErrors = accountValidator.getErrorsLogin(loginCredentials, account)
					callback(validationErrors, account)
				}
			})
		},

		getAccountById: function(accountId, callback){
			accountRepository.getAccountById(accountId, callback)
		},

		updateAccountBio: function(newBioText, accountUsername, callback){
			accountRepository.updateAccountBio(newBioText, accountUsername, callback)
		}
	}
}

