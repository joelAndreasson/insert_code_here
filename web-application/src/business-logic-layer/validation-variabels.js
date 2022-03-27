
//All validation variables, regex and arrays
module.exports = function({}){
    const variables = {
        MIN_USERNAME_LENGTH: 3,
        MAX_USERNAME_LENGTH: 20,
        MIN_PASSWORD_LENGTH: 3,
        MAX_PASSWORD_LENGTH: 25,
        MIN_TITLE_LENGTH: 3,
        ALL_PROG_LANGUAGES: ["Python", "Kotlin", "C++", "JavaScript","SQL","Swift"], // This is also used to iterate over in the "challenge-create.hbs" file and in the SPA
        ALL_DIFFICULTIES: ["Easy", "Medium", "Hard"], // This is also used to iterate over in the "challenge-create.hbs" file and in the SPA
        MIN_DESCRIPTION_LENGTH: 5,
        MIN_AMOUNT_OF_BLANKS: 1,
        SOLUTIONS_REGEX: /(?<=\[\[).*?(?=\]\])/g,
        BLANKS_REGEX: /\[\[INSERT_CODE_HERE\]\]/g,
        MIN_COMMENT_LENGTH: 5, 

        // ----- All error codes -----
        databaseError: "databaseError",
        usernameMissing: "usernameMissing",
        usernameTooShort: "usernameTooShort",
        passwordsNotMatch: "passwordsNotMatch",
        accountDoesNotExist: "accountDoesNotExist",
        notEnoughBlanks: "notEnoughBlanks",
        solutionsNotMatchBlanks: "solutionsNotMatchBlanks",
        titleTooShort: "titleTooShort",
        progLanguageNotValid: "progLanguageNotValid",
        difficultyNotValid: "difficultyNotValid",
        descriptionTooShort: "descriptionTooShort",
        numOfBlanksChanged: "numOfBlanksChanged",
        commentTooShort: "commentTooShort",
        passwordToShort: "passwordToShort",
        passwordToLong: "passwordToLong",
        usernameTaken: "usernameTaken",
        challengeNotExist: "challengeNotExist",
        accountNotExist: "accountNotExist",
        notAuthorized: "notAuthorized",

    }

    return variables
}
    