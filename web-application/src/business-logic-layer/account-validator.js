const bcrypt = require('bcrypt')


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

			// Validate password 
			if(accountInformation.password.length < validationVariabels.MIN_PASSWORD_LENGTH){
				errors.push("passwordToShort")
			}else if(accountInformation.password.length > validationVariabels.MAX_PASSWORD_LENGTH){
				errors.push("passwordToLong")
			}
			if(accountInformation.password2 != accountInformation.password){
				errors.push("passwordsNotMatch")
			}
			
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


