

module.exports = function({initSequelize, validationVariabels}){
    return {
        getAllAccounts: function(callback){
            initSequelize.accounts.findAll({raw: true})
                .then(accounts => callback([], accounts))
                .catch(error => {
                    console.log(error)
                    callback([validationVariabels.databaseError], null)
                })
        },

        getAccountByUsername: function(username, callback){
            initSequelize.accounts.findOne({where: {username: username}, raw: true})
                .then(account => callback([], account))
                .catch(error => {
                    console.log(error)
                    callback([validationVariabels.databaseError], null)
                })
        },

        getAccountByCredentials: function(loginCredentials, callback){
            initSequelize.accounts.findOne({
                where: {username: loginCredentials.username, password: loginCredentials.password}, 
                raw: true
            })
                .then(account => callback([], account))
                .catch(error => {
                    console.log(error)
                    callback([validationVariabels.databaseError], null)
                })
        },

        createAccount: function(accountInformation, callback){
            initSequelize.accounts.create({
                username: accountInformation.username,
                password: accountInformation.password,
                bio: accountInformation.bio
            })
            .then(createdAccount => callback([], createdAccount.id))
            .catch(error => {
                if(error.name == "SequelizeUniqueConstraintError"){
                    console.log(error)
                    callback([validationVariabels.usernameTaken], null)
                }
                else{
                    console.log(error)
                    callback([validationVariabels.databaseError], null)
                }
                
            })
        },

        getAccountById: function(accountId, callback){
			initSequelize.accounts.findByPk(accountId, {raw: true})
                .then(account => callback([], account))
                .catch(error => {
                    console.log(error)
                    callback([validationVariabels.databaseError], null)
                })
		},

        updateAccountBio: function(newBioText, accountUsername, callback){
            initSequelize.accounts.update({bio: newBioText}, {where: {username: accountUsername}})
                .then(results => callback([], results))
                .catch(error => {
                    console.log(error)
                    callback([validationVariabels.databaseError], null)
                })

		}

    }
}