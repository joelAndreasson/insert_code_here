
module.exports = function({validationVariabels}){
    //const validation = validationVariabels.variables
    return {
        translateErrorCodes: function(errorCodes){
            const errorTranslations = {
                databaseError: "Internal server error, please try again later...", //What should this say?
                usernameMissing: "Please enter a username",
                usernameTooShort: "The username has to be a minimum of" + validationVariabels.MIN_USERNAME_LENGTH + " characters",
                passwordsNotMatch: "Passwords does not match",
                accountDoesNotExist: "Username or password did not match any account, please try again",
                notEnoughBlanks: "There needs to be a minimum of " + validationVariabels.MIN_AMOUNT_OF_BLANKS + " [[INSERT_CODE_HERE]] brackets",
                solutionsNotMatchBlanks: "The number of solutions needs to be the same as the number of [[INSERT_CODE_HERE]] brackets",
                titleTooShort: "Title needs to be at least " + validationVariabels.MIN_TITLE_LENGTH + " characters",
                progLanguageNotValid: "Select a valid programming language",
                difficultyNotValid: "Select a valid difficulty",
                descriptionTooShort: "Description needs to be at least " + validationVariabels.MIN_DESCRIPTION_LENGTH + " characters",
                numOfBlanksChanged: "The number of [[INSERT_CODE_HERE]] brackets needs to be the same as it was originally",
                commentTooShort: "Comment needs to be at least " + validationVariabels.MIN_COMMENT_LENGTH + " characters",
                passwordToShort: "Password must be more than " + validationVariabels.MIN_PASSWORD_LENGTH + " characters",
                passwordToLong: "Password cannot be more than " + validationVariabels.MAX_PASSWORD_LENGTH + " characters",
                usernameTaken: "Username already taken"
            }
    
            const translations = errorCodes.map(error => errorTranslations[error])
            return translations
        }
    }
}


