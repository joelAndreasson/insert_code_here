const awilix = require('awilix')

const container = awilix.createContainer()

container.register("accountRepository", awilix.asFunction(require('./data-access-layer/account-repository')))
container.register("challengeRepository", awilix.asFunction(require('./data-access-layer/challenge-repository')))
container.register("commentRepository", awilix.asFunction(require('./data-access-layer/comment-repository')))

container.register("accountManager", awilix.asFunction(require('./business-logic-layer/account-manager')))
container.register("challengeManager", awilix.asFunction(require('./business-logic-layer/challenge-manager')))
container.register("commentManager", awilix.asFunction(require('./business-logic-layer/comment-manager')))

container.register("accountValidator", awilix.asFunction(require('./business-logic-layer/account-validator')))
container.register("challengeValidator", awilix.asFunction(require('./business-logic-layer/challenge-validator')))
container.register("commentValidator", awilix.asFunction(require('./business-logic-layer/comment-validator')))

container.register("variousRouter", awilix.asFunction(require('./presentation-layer/routers/various-router')))
container.register("accountRouter", awilix.asFunction(require('./presentation-layer/routers/account-router')))
container.register("challengeRouter", awilix.asFunction(require('./presentation-layer/routers/challenge-router')))
container.register("commentRouter", awilix.asFunction(require('./presentation-layer/routers/comment-router')))

container.register("db", awilix.asFunction(require('./data-access-layer/db')))
container.register("app", awilix.asFunction(require('./presentation-layer/app')))
container.register("baseModel", awilix.asFunction(require('./presentation-layer/base-model')))

const app = container.resolve("app")

// Start listening for incoming HTTP requests!
app.listen(8080, function(){
    console.log('Running on 8080!')
})