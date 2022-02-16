const accountRepository = require('../data-access-layer/account-repository')
const accountValidator = require('./account-validator')
const bcrypt = require('bcrypt')
const { response } = require('express')

// brcypt variables
const saltRounds = 10

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

	// hash password
	/*bcrypt.hash(accountInformation.password, saltRounds, function(error, hash) {
		if(error){
			// later on redirect to internal server error page.
			callback(error, null)
			return
		}else{
			console.log("1: "+accountInformation.password)
			accountInformation.password = hash
			console.log("2: "+accountInformation.password)
			
		}	
	})*/
	const hash = bcrypt.hashSync(accountInformation.password, saltRounds);
	accountInformation.password = hash
	console.log("3: "+accountInformation.password)
	accountRepository.createAccount(accountInformation, callback)	
}

exports.getAccountByUsername = function(username, callback){
	accountRepository.getAccountByUsername(username, callback)
}

exports.getAccountByCredentials = function(loginCredentials, callback){
	accountRepository.getAccountByCredentials(loginCredentials, callback)
}