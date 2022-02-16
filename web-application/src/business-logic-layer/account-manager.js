const accountRepository = require('../data-access-layer/account-repository')
const accountValidator = require('./account-validator')
const bcrypt = require('bcrypt')
const { response } = require('express')

// brcypt variables
const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds);

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
	accountInformation.password = bcrypt.hashSync(accountInformation.password, salt);
	accountRepository.createAccount(accountInformation, callback)	
}

exports.getAccountByUsername = function(username, callback){
	accountRepository.getAccountByUsername(username, callback)
}

exports.login = function(loginCredentials, callback){
	accountRepository.getAccountByUsername(loginCredentials.username, function(errors,account){
		if(errors.length > 0){
			callback(['databaseError'], null)
		}else {
			const validationErrors = accountValidator.getErrorsLogin(loginCredentials, account)
			callback(validationErrors, account)
		}
	})
}