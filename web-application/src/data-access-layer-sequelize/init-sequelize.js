const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('postgres://postgres:hejsan123@postgres_database:5432/postgresDatabase')

const accounts = sequelize.define('accounts', {
    username: {
        type: DataTypes.TEXT,
        unique: true
    },
    password: DataTypes.TEXT,
    bio: DataTypes.TEXT
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
    datePublished: DataTypes.TEXT, // Date not working, FIX!!
    numOfPlays: DataTypes.INTEGER,
    accountUsername: DataTypes.TEXT
}, {
    timestamps: false
})

const comments = sequelize.define('comments', {
    commentText: DataTypes.TEXT,
    accountUsername: DataTypes.TEXT,
    challengeId: DataTypes.INTEGER
}, {
    timestamps: false
})

challenges.hasMany(comments, {foreignKey: 'challengeId'})
comments.belongsTo(challenges)

accounts.hasMany(challenges, {foreignKey: 'accountUsername', sourceKey: 'username'})
challenges.belongsTo(accounts, {foreignKey: 'accountUsername', sourceKey: 'username'})

accounts.hasMany(comments, {foreignKey: 'accountUsername', sourceKey: 'username'})
comments.belongsTo(accounts, {foreignKey: 'accountUsername', sourceKey: 'username'})

sequelize.sync()

module.exports = function({}){
    return {accounts, challenges, comments}
}

