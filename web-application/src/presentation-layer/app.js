const path = require('path')
const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const session = require('express-session')
const cookieParser = require('cookie-parser')
//const mySql = require('mysql') // not used anymore
const redis = require('redis')
const csurf = require('csurf')
const redisClient = redis.createClient(process.env.REDIS_URL)
const RedisStore = require('connect-redis')(session)
	
redisClient.on("error", function(err) {
    console.log("Error " + err);
});

module.exports = function({accountRouter, challengeRouter, variousRouter, commentRouter, baseModel, restApiRouter}){
	app.use(express.urlencoded({
		extended: false
	}))

	app.use('/static', express.static("public"))
	
	app.use(session({
		store: new RedisStore({ client: redisClient,  ttl: 60 * 60 * 1  }), //Magic numbers?????
		secret: "jasirhwenvjhsduyqkvhsaoeruhgrhasdfm",
		saveUninitialized: false,
		resave: false
	}))
	
	app.use(cookieParser())
	
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
	
	// Attach REST API router before csurf and baseModel, making it so no API response will send cookies or csrf tokens
	app.use('/api', restApiRouter)
	
	app.use(csurf({cookie: true}))
	app.use(baseModel)

	//Attach the rest of the routers
	app.use('/accounts', accountRouter)
	app.use('/challenges', challengeRouter)
	app.use('/challenges/:challengeId/comments', commentRouter)
	app.use('/', variousRouter)

	return app
}



