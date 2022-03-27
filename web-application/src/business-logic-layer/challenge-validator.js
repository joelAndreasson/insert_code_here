module.exports = function({validationVariabels}){
    return{
        getErrorsNewChallenge: function(challenge){
            const errors = []

            const blankAnswers = challenge.challengeText.match(validationVariabels.BLANKS_REGEX)
            const solutionAnswers = challenge.solutionText.match(validationVariabels.SOLUTIONS_REGEX)

            if(!blankAnswers || blankAnswers.length < validationVariabels.MIN_AMOUNT_OF_BLANKS){
                errors.push("notEnoughBlanks")
            }
            if(!blankAnswers || !solutionAnswers || blankAnswers.length != solutionAnswers.length){
                errors.push("solutionsNotMatchBlanks")
            }
            

            if(challenge.title.length < validationVariabels.MIN_TITLE_LENGTH){
                errors.push("titleTooShort")
            }
            if(!validationVariabels.ALL_PROG_LANGUAGES.includes(challenge.progLanguage)){
                errors.push("progLanguageNotValid")
            }
            if(!validationVariabels.ALL_DIFFICULTIES.includes(challenge.difficulty)){
                errors.push("difficultyNotValid")
            }
            if(challenge.description.length < validationVariabels.MIN_DESCRIPTION_LENGTH){
                errors.push("descriptionTooShort")
            }

            return errors
        },

        getErrorsPlayChallenge: function(enteredAnswers, solutionAnswers){
            const errors = []

            if(!enteredAnswers || enteredAnswers.length != solutionAnswers.length){
                errors.push("numOfBlanksChanged")
            }

            return errors
        },

        getErrorsFetchChallenge: function(challenge){
            var errors = []
            if(challenge == undefined){
                errors.push("challengeNotExist")
            }
            return errors
        }

    }
}

