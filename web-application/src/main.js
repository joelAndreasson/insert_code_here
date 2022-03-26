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

const app = container.resolve("app")

app.listen(8080, function(){
    console.log('Running on 8080!')
})