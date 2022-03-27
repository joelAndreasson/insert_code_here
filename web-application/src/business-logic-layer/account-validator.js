const bcrypt = require('bcrypt')


module.exports = function({validationVariabels}){
	return{
		getErrorsNewAccount: function(accountInformation){
			const errorCodes = []

			// Validate username.
			if(!accountInformation.hasOwnProperty("username")){
				errorCodes.push(validationVariabels.usernameMissing)
			}else if(accountInformation.username.length < validationVariabels.MIN_USERNAME_LENGTH){
				errorCodes.push(validationVariabels.usernameTooShort)
			}
			if(validationVariabels.MAX_USERNAME_LENGTH < accountInformation.username.length){
				errorCodes.push(validationVariabels.usernameTooLong)
			}

			// Validate password 
			if(accountInformation.password.length < validationVariabels.MIN_PASSWORD_LENGTH){
				errorCodes.push(validationVariabelspasswordToShort)
			}else if(accountInformation.password.length > validationVariabels.MAX_PASSWORD_LENGTH){
				errorCodes.push(validationVariabels.passwordToLong)
			}
			if(accountInformation.password2 != accountInformation.password){
				errorCodes.push(validationVariabels.passwordsNotMatch)
			}
			
			return errorCodes
		},

		getErrorsLogin: function(loginCredentials, account){
			const errorCodes = []
	
			if(account == null){
				errorCodes.push(validationVariabels.accountDoesNotExist)
			}else if(!bcrypt.compareSync(loginCredentials.password, account.password)){
				errorCodes.push(validationVariabels.accountDoesNotExist)
			}

			return errorCodes
		},

		getErrorsFetchAccount: function(account){
			const errorCodes = []

			if(account == undefined){
				errorCodes.push(validationVariabels.accountNotExist)
			}

			return errorCodes
		},

		getErrorsUpdateBio: function(requesterUsername, profileAccountUsername){
			const errorCodes = []

			console.log("requesterUsername: " + requesterUsername)
			console.log("profileAccountUsername: " + profileAccountUsername)

			if(profileAccountUsername != requesterUsername){ //ADD MAX LENGTH CHECK!!!!!!!!!!!!
				errorCodes.push(validationVariabels.notAuthorized)
			}

			return errorCodes
		}
	}
}


