

module.exports = function({initSequelize}){
    return {
        getAllAccounts: function(callback){
            initSequelize.accounts.findAll({raw: true})
                .then(accounts => callback([], accounts))
                .catch(error => {
                    console.log(error)
                    callback(['databaseError'], null)
                })
        },

        getAccountByUsername: function(username, callback){
            initSequelize.accounts.findOne({where: {username: username}, raw: true})
                .then(account => callback([], account))
                .catch(error => {
                    console.log(error)
                    callback(['databaseError'], null)
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
                    callback(['databaseError'], null)
                })
        },

        createAccount: function(accountInformation, callback){
            initSequelize.accounts.create({ //Maybe only enter "accountInformation" model here directly?
                username: accountInformation.username,
                password: accountInformation.password,
                bio: accountInformation.bio
            })
            .then(createdAccount => callback([], createdAccount.id))
            .catch(error => {
                console.log(error)
                callback(['databaseError'], null)
            })
        },

        getAccountById: function(accountId, callback){ //fill this function at later date
			initSequelize.accounts.findByPk(accountId, {raw: true})
                .then(account => callback([], account))
                .catch(error => {
                    console.log(error)
                    callback(['databaseError'], null)
                })
		},

        updateAccountBio: function(newBioText, accountUsername, callback){ // fill in at later date
            initSequelize.accounts.update({bio: newBioText}, {where: {username: accountUsername}})
                .then(results => callback([], results)) //results not needed ???
                .catch(error => {
                    console.log(error)
                    callback(['databaseError'], null)
                })

		}

    }
}