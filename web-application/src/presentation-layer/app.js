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

const awilix = require('awilix')

const accountRepository = require('../data-access-layer/account-repository')
const challengeRepository = require('../data-access-layer/challenge-repository')
const commentRepository = require('../data-access-layer/comment-repository')

const accountManager = require('../business-logic-layer/account-manager')
const challengeManager = require('../business-logic-layer/challenge-manager')
const commentManager = require('../business-logic-layer/comment-manager')

const accountValidator = require('../business-logic-layer/account-validator')
const challengeValidator = require('../business-logic-layer/challenge-validator')
const commentValidator = require('../business-logic-layer/comment-validator')

const variousRouter = require('./routers/various-router')
const accountRouter = require('./routers/account-router')
const challengeRouter = require('./routers/challenge-router')
const commentRouter = require('./routers/comment-router')

const db = require('../data-access-layer/db')

const container = awilix.createContainer()
container.register("accountRepository", awilix.asFunction(accountRepository))
container.register("challengeRepository", awilix.asFunction(challengeRepository))
container.register("commentRepository", awilix.asFunction(commentRepository))

container.register("accountManager", awilix.asFunction(accountManager))
container.register("challengeManager", awilix.asFunction(challengeManager))
container.register("commentManager", awilix.asFunction(commentManager))

container.register("accountValidator", awilix.asFunction(accountValidator))
container.register("challengeValidator", awilix.asFunction(challengeValidator))
container.register("commentValidator", awilix.asFunction(commentValidator))

container.register("variousRouter", awilix.asFunction(variousRouter))
container.register("accountRouter", awilix.asFunction(accountRouter))
container.register("challengeRouter", awilix.asFunction(challengeRouter))
container.register("commentRouter", awilix.asFunction(commentRouter))

//container.register("mySql", awilix.asClass(mySql)) // NOT WORKING
container.register("db", awilix.asFunction(db))

const theAccountRouter = container.resolve("accountRouter")
const theChallengeRouter = container.resolve("challengeRouter")
const theVariousRouter = container.resolve("variousRouter")
const theCommentRouter = container.resolve("commentRouter")



const { baseModel } = require('./base-model.js')
const { asFunction } = require('awilix')

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
app.use('/', theVariousRouter)
app.use('/accounts', theAccountRouter)
app.use('/challenges', theChallengeRouter)
app.use('/challenges/:id/comments', theCommentRouter) 

// Start listening for incoming HTTP requests!
app.listen(8080, function(){
	console.log('Running on 8080!')
})