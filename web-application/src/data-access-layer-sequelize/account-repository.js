

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
            initSequelize.accounts.create({
                username: accountInformation.username,
                password: accountInformation.password
            })
            .then(createdAccount => callback([], createdAccount.id))
            .catch(error => {
                console.log(error)
                callback(['databaseError'], null)
            })
        }

    }
}