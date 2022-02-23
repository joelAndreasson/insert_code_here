const path = require('path')
const express = require('express')
const { engine } = require('express-handlebars')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mySql = require('mysql')
const redis = require('redis')
const redisClient = redis.createClient(process.env.REDIS_URL)
const RedisStore = require('connect-redis')(session)
	
redisClient.on("error", function(err) {
    console.log("Error " + err);
});

const variousRouter = require('./routers/various-router')
const accountRouter = require('./routers/account-router')
const challengeRouter = require('./routers/challenge-router')
const commentRouter = require('./routers/comment-router') // MAYBE THIS IS NOT NEEDED??

const { baseModel } = require('./base-model.js')

const app = express()

app.use(express.urlencoded({
	extended: false
}))

app.use(session({
	store: new RedisStore({ client: redisClient,  ttl: 60 * 60 * 1  }),
	secret: "jasirhwenvjhsduyqkvhsaoeruhgrhasdfm",
	saveUninitialized: false,
	resave: false
}))

const options = {
	host: 'localhost',
	port: 3306,
	user: 'db_user',
	password: 'theRootPassword'
}

var connection = mySql.createConnection(options)


app.use(cookieParser())
app.use(baseModel)

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
app.use('/challenges/:id/comments', commentRouter) // MAYBE THIS IS NOT NEEDED??

// Start listening for incoming HTTP requests!
app.listen(8080, function(){
	console.log('Running on 8080!')
})