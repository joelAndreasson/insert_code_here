
const mysql = require('mysql')

module.exports = function({}){
	const connection = mysql.createConnection({
		host     : 'database',
		user     : 'root',
		password : 'theRootPassword',
		database : 'webAppDatabase',
		dateStrings: true
	})
	
	return connection
}

