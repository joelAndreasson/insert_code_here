

module.exports = function({db, validationVariabels}){
	return{
		getAllAccounts: function(callback){
			const query = `SELECT * FROM accounts ORDER BY username`
			const values = []
			
			db.query(query, values, function(error, accounts){
				if(error){
					callback([validationVariabels.databaseError], null)
				}else{
					callback([], accounts)
				}
			})
		},

		getAccountByUsername: function(username, callback){
			const query = `SELECT * FROM accounts WHERE username = ? LIMIT 1`
			const values = [username]
			
			db.query(query, values, function(error, accounts){
				if(error){
					callback([validationVariabels.databaseError], null)
				}else{
					callback([], accounts[0])
				}
			})
		},

		getAccountByCredentials: function(loginCredentials, callback){
			const query = `SELECT * FROM accounts WHERE username = ? AND username = ? LIMIT 1`
			const values = [loginCredentials.username, loginCredentials.password]
			
			db.query(query, values, function(error, accounts){
				if(error){
					callback([validationVariabels.databaseError], null)
				}else{
					callback([], accounts[0])
				}
			})
		},

		createAccount: function(accountInformation, callback){
			const query = `INSERT INTO accounts (username, password) VALUES (?, ?)`
			const values = [accountInformation.username, accountInformation.password]
			
			db.query(query, values, function(error, results){
				if(error){
					if(error.code == "ER_DUP_ENTRY"){
						callback([validationVariabels.usernameTaken], null)
					}
					else{
						callback([validationVariabels.databaseError], null)
					}
				}else{
					callback([], results)
				}
			})
		},

		getAccountById: function(accountId, callback){
			const query = `SELECT * FROM accounts WHERE id = ? LIMIT 1`
			const values = [accountId]

			db.query(query, values, function(error, account){
				if(error){
					callback([validationVariabels.databaseError], null)
				}else {
					callback([], account[0])
				}
			})
		},

		updateAccountBio: function(newBioText, accountUsername, callback){
			const query = `UPDATE accounts SET bio = ? WHERE username = ?`
			const values = [newBioText, accountUsername]

			db.query(query, values, function(error, results){
				if(error){
					callback([validationVariabels.databaseError], null)
				}else {
					callback([], results)
				}
			})
		}
	}
}


