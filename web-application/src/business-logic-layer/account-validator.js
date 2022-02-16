const bcrypt = require('bcrypt')

const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 10

exports.getErrorsNewAccount = function(accountInformation){
	
	const errors = []
	
	// Validate username.
	if(!accountInformation.hasOwnProperty("username")){
		errors.push("usernameMissing")
	}else if(accountInformation.username.length < MIN_USERNAME_LENGTH){
		errors.push("usernameTooShort")
	}
	if(MAX_USERNAME_LENGTH < accountInformation.username.length){
		errors.push("usernameTooLong")
	}
	if(accountInformation.password2 != accountInformation.password){
		errors.push("Passwords does not match")
	}
	
	return errors
	
}

exports.getErrorsLogin = function(loginCredentials, account){
	const errors = []
	
	if(account == null){
		errors.push("Username or password did not match any account, please try again")
	}else if(!bcrypt.compareSync(loginCredentials.password, account.password)){
		errors.push("Username or password did not match any account, please try again")
	}

	return errors
}
