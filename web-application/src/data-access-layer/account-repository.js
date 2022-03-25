

module.exports = function({db}){
	return{
		getAllAccounts: function(callback){
			const query = `SELECT * FROM accounts ORDER BY username`
			const values = []
			
			db.query(query, values, function(error, accounts){
				if(error){
					callback(['databaseError'], null)
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
					console.log(error.code)
					callback(['databaseError'], null)
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
					callback(['databaseError'], null)
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
					console.log(error.code) // TODO: Remove
					if(error.code == "ER_DUP_ENTRY"){
						callback(['usernameTaken'], null)
					}
					else{
						callback(['databaseError'], null)
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
					// better error handling
					callback(['databaseError'], null)
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
					callback(['databaseError'], null)
				}else {
					callback([], results) // results unnecessary???
				}
			})
		}
	}
}


