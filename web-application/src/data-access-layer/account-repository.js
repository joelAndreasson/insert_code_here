

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
					// TODO: Look for usernameUnique violation.
					callback(['databaseError'], null)
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

		editAccountBio: function(newBioText, accountId, callback){
			const query = `UPDATE accounts SET bio = ? WHERE id = ?`
			const values = [newBioText, accountId]

			db.query(query, values, function(error, results){
				if(error){
					callback(['databaseError'], null)
				}else {
					callback([], results)
				}
			})
		}
	}
}


