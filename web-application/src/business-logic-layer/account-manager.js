const accountRepository = require('../data-access-layer/account-repository')
const accountValidator = require('./account-validator')

exports.getAllAccounts = function(callback){
	accountRepository.getAllAccounts(callback)
}

exports.createAccount = function(accountInformation, callback){
	
	// Validate the account.
	const errors = accountValidator.getErrorsNewAccount(accountInformation)
	
	if(0 < errors.length){
		callback(errors, null)
		return
	}
	
	accountRepository.createAccount(accountInformation, callback)
	
}

exports.getAccountByUsername = function(username, callback){
	accountRepository.getAccountByUsername(username, callback)
}