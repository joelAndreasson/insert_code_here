const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('postgres//:postgres:hejsan123@postgres:5432/postgresDatabase') // Put this is init-sequelize

const challenges = sequelize.define('challenges', {
    title: DataTypes.TEXT,
    challengeText: DataTypes.TEXT,
    solutionText: DataTypes.TEXT,
    progLanguage: DataTypes.TEXT,
    difficulty: DataTypes.TEXT,
    description: DataTypes.TEXT,
    datePublished: DataTypes.DATE,
    numOfPlays: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
})

challenges.sync()

module.exports = function({}){
    return{
        
    }
}
