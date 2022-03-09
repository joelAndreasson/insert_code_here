const awilix = require('awilix')

const container = awilix.createContainer()

container.register({
    //------ DATA ACCESS LAYER MYSQL ------
    accountRepository: awilix.asFunction(require('./data-access-layer/account-repository')), // MySQL database
    challengeRepository: awilix.asFunction(require('./data-access-layer/challenge-repository')), // MySQL database
    commentRepository: awilix.asFunction(require('./data-access-layer/comment-repository')), // MySQL database
    db: awilix.asFunction(require('./data-access-layer/db')),

    //------ DATA ACCESS LAYER SEQUELIZE WITH POSTGRESQL ------
    //accountRepository: awilix.asFunction(require('./data-access-layer-sequelize/account-repository')), // Sequelize with PostgreSQL database
    //challengeRepository: awilix.asFunction(require('./data-access-layer-sequelize/challenge-repository')), // Sequelize with PostgreSQL database
    //commentRepository: awilix.asFunction(require('./data-access-layer/comment-repository')), // Sequelize with PostgreSQL database
    initSequelize: awilix.asFunction(require('./data-access-layer-sequelize/init-sequelize')),

    //------ BUSINESS LOGIC LAYER ------
    accountManager: awilix.asFunction(require('./business-logic-layer/account-manager')),
    challengeManager: awilix.asFunction(require('./business-logic-layer/challenge-manager')),
    commentManager: awilix.asFunction(require('./business-logic-layer/comment-manager')),

    accountValidator: awilix.asFunction(require('./business-logic-layer/account-validator')),
    challengeValidator: awilix.asFunction(require('./business-logic-layer/challenge-validator')),
    commentValidator: awilix.asFunction(require('./business-logic-layer/comment-validator')),
    validationVariabels: awilix.asFunction(require('./business-logic-layer/validation-variabels')),

    //------ PRESENTATION LAYER ------
    app: awilix.asFunction(require('./presentation-layer/app')),
    errorTranslator: awilix.asFunction(require('./presentation-layer/error-translator')),
    baseModel: awilix.asFunction(require('./presentation-layer/base-model')),

    variousRouter: awilix.asFunction(require('./presentation-layer/routers/various-router')),
    accountRouter: awilix.asFunction(require('./presentation-layer/routers/account-router')),
    challengeRouter: awilix.asFunction(require('./presentation-layer/routers/challenge-router')),
    commentRouter: awilix.asFunction(require('./presentation-layer/routers/comment-router')),

    //------ REST API PRESENTATION LAYER ------
    restApiRouter: awilix.asFunction(require('./presentation-layer-rest-api/rest-api-router')),

})

/*
container.register("accountRepository", awilix.asFunction(require('./data-access-layer/account-repository'))) //MySQL database
container.register("challengeRepository", awilix.asFunction(require('./data-access-layer/challenge-repository'))) //MySQL database
container.register("commentRepository", awilix.asFunction(require('./data-access-layer/comment-repository'))) //MySQL database

//container.register("accountRepository", awilix.asFunction(require('./data-access-layer-sequelize/account-repository'))) //Sequelize with PostgreSQL database
//container.register("challengeRepository", awilix.asFunction(require('./data-access-layer-sequelize/challenge-repository'))) //Sequelize with PostgreSQL database
//container.register("commentRepository", awilix.asFunction(require('./data-access-layer-sequelize/comment-repository'))) //Sequelize with PostgreSQL database
container.register("initSequelize", awilix.asFunction(require('./data-access-layer-sequelize/init-sequelize'))) //Initialize sequelize

container.register("accountManager", awilix.asFunction(require('./business-logic-layer/account-manager')))
container.register("challengeManager", awilix.asFunction(require('./business-logic-layer/challenge-manager')))
container.register("commentManager", awilix.asFunction(require('./business-logic-layer/comment-manager')))

container.register("accountValidator", awilix.asFunction(require('./business-logic-layer/account-validator')))
container.register("challengeValidator", awilix.asFunction(require('./business-logic-layer/challenge-validator')))
container.register("commentValidator", awilix.asFunction(require('./business-logic-layer/comment-validator')))

container.register("validationVariabels", awilix.asFunction(require('./business-logic-layer/validation-variabels')))
container.register("errorTranslator", awilix.asFunction(require('./presentation-layer/error-translator')))

container.register("variousRouter", awilix.asFunction(require('./presentation-layer/routers/various-router')))
container.register("accountRouter", awilix.asFunction(require('./presentation-layer/routers/account-router')))
container.register("challengeRouter", awilix.asFunction(require('./presentation-layer/routers/challenge-router')))
container.register("commentRouter", awilix.asFunction(require('./presentation-layer/routers/comment-router')))

container.register("restApiRouter", awilix.asFunction(require('./presentation-layer-rest-api/rest-api-router')))

container.register("db", awilix.asFunction(require('./data-access-layer/db')))
container.register("app", awilix.asFunction(require('./presentation-layer/app')))
container.register("baseModel", awilix.asFunction(require('./presentation-layer/base-model')))
*/

const app = container.resolve("app")

// Start listening for incoming HTTP requests!
app.listen(8080, function(){
    console.log('Running on 8080!')
})