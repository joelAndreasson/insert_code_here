
const bcrypt = require('bcrypt')
const { response } = require('express') // UNNECESSARY??

// brcypt variables
const saltRounds = 10 // globals?
const salt = bcrypt.genSaltSync(saltRounds)

module.exports = function({accountRepository, accountValidator}){
	return{
		getAllAccounts: function(callback){
			accountRepository.getAllAccounts(callback)
		},

		createAccount: function(accountInformation, callback){
			
			// Validate the account.
			const validationErrorCodes = accountValidator.getErrorsNewAccount(accountInformation)
			if(validationErrorCodes.length > 0){
				callback(validationErrorCodes, null)
				return
			}
			// hash password
			accountInformation.password = bcrypt.hashSync(accountInformation.password, salt);
			accountRepository.createAccount(accountInformation, callback)	
		},

		getAccountByUsername: function(username, callback){
			accountRepository.getAccountByUsername(username, function(errorCodes, account){
				var allErrors = []
				allErrors.push(...errorCodes)
				const validationErrorCodes = accountValidator.getErrorsFetchAccount(account)
				allErrors.push(...validationErrorCodes)
				if(allErrors.length > 0){
					callback(allErrors, account)
				}else {
					callback([], account)
				}
			})
		},

		login: function(loginCredentials, callback){
			accountRepository.getAccountByUsername(loginCredentials.username, function(errorCodes,account){
				if(errorCodes.length > 0){
					callback(errorCodes, null)
				}else {
					const validationErrorCodes = accountValidator.getErrorsLogin(loginCredentials, account)
					callback(validationErrorCodes, account)
				}
			})
		},

		getAccountById: function(accountId, callback){
			accountRepository.getAccountById(accountId, callback)
		},

		updateAccountBio: function(newBioText, accountUsername, callback){

			const validationErrorCodes = accountValidator.getErrorsUpdateBio(newBioText)
			if(validationErrorCodes.length > 0){
				callback(validationErrorCodes, null)
				return
			}
			accountRepository.updateAccountBio(newBioText, accountUsername, callback)
		}
	}
}

