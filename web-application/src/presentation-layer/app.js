const path = require('path')
const express = require('express')
const { engine } = require('express-handlebars')

const variousRouter = require('./routers/various-router')
const accountRouter = require('./routers/account-router')
const challengeRouter = require('./routers/challenge-router')

const app = express()

app.use(express.urlencoded({
	extended: false
}))

// Setup express-handlebars.
app.set('views', path.join(__dirname, 'views'))

// Note: This code is for an old version of express-handlebars.
// One should use newest version of packages.
app.engine('hbs', engine({
	extname: 'hbs',
	defaultLayout: 'main',
	layoutsDir: path.join(__dirname, 'layouts')
}))

// Handle static files in the public folder.
app.use(express.static(path.join(__dirname, 'public')))
//app.use(express.static(path.join(__dirname, 'codemirror'))) // SHOULD MAYBE BE REMOVED???

// Attach all routers.
app.use('/', variousRouter)
app.use('/accounts', accountRouter)
app.use('/challenges', challengeRouter)

// Start listening for incoming HTTP requests!
app.listen(8080, function(){
	console.log('Running on 8080!')
})