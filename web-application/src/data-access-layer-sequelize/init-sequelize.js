const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('postgres://postgres:hejsan123@postgres_database:5432/postgresDatabase')

const accounts = sequelize.define('accounts', {
    username: {
        type: DataTypes.TEXT,
        unique: true
    },
    password: DataTypes.TEXT
}, {
    timestamps: false
})

const challenges = sequelize.define('challenges', {
    title: DataTypes.TEXT,
    challengeText: DataTypes.TEXT,
    solutionText: DataTypes.TEXT,
    progLanguage: DataTypes.TEXT,
    difficulty: DataTypes.TEXT,
    description: DataTypes.TEXT,
    datePublished: DataTypes.TEXT, // Date not working
    numOfPlays: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
}, {
    timestamps: false
})

const comments = sequelize.define('comments', {
    commentText: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    challengeId: DataTypes.INTEGER
}, {
    timestamps: false
})

challenges.hasMany(comments, {foreignKey: 'challengeId'})
comments.belongsTo(challenges)

sequelize.sync()

module.exports = function({}){
    return {accounts, challenges, comments}
}

