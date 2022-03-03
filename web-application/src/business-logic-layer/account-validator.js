const bcrypt = require('bcrypt')

const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 10

module.exports = function({validationVariabels}){
	return{
		getErrorsNewAccount: function(accountInformation){
			const errors = []
	
			// Validate username.
			if(!accountInformation.hasOwnProperty("username")){
				errors.push("usernameMissing")
			}else if(accountInformation.username.length < validationVariabels.MIN_USERNAME_LENGTH){
				errors.push("usernameTooShort")
			}
			if(validationVariabels.MAX_USERNAME_LENGTH < accountInformation.username.length){
				errors.push("usernameTooLong")
			}
			if(accountInformation.password2 != accountInformation.password){
				errors.push("passwordsNotMatch")
			}

			//TODO: Add a "passwordTooShort" validation
			
			return errors
		},

		getErrorsLogin: function(loginCredentials, account){
			const errors = []
	
			if(account == null){
				errors.push("accountDoesNotExist")
			}else if(!bcrypt.compareSync(loginCredentials.password, account.password)){
				errors.push("accountDoesNotExist")
			}

			return errors
		}
	}
}


