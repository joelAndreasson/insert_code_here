const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('postgres://postgres:hejsan123@postgres_database:5432/postgresDatabase')

const accounts = sequelize.define('accounts', {
    username: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
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
    datePublished: DataTypes.TEXT,
    numOfPlays: DataTypes.INTEGER,
    accountUsername: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false
})

const comments = sequelize.define('comments', {
    commentText: DataTypes.TEXT,
    accountUsername: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    challengeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
})

challenges.hasMany(comments, {foreignKey: 'challengeId', onDelete: 'CASCADE'})
comments.belongsTo(challenges)

accounts.hasMany(challenges, {foreignKey: 'accountUsername', sourceKey: 'username'})
challenges.belongsTo(accounts, {foreignKey: 'accountUsername', sourceKey: 'username'})

accounts.hasMany(comments, {foreignKey: 'accountUsername', sourceKey: 'username'})
comments.belongsTo(accounts, {foreignKey: 'accountUsername', sourceKey: 'username'})

sequelize.sync()

module.exports = function({}){
    return {accounts, challenges, comments}
}

