
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
        MAX_BIO_LENGTH: 400,
        MIN_COMMENT_LENGTH: 5,
        
        // The following three values are the start values when creating a new challenge.
        START_CHALLENGE_TEXT: 'console.log("[[INSERT_CODE_HERE]]")\n\n// What should the blank say in order to print out "Hello world"?',
        START_SOLUTION_TEXT: '[[Hello world]]',
        START_PROG_LANGUAGE: 'JavaScript',


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
        bioToLong: "bioToLong"
      
    }

    return variables
}
    