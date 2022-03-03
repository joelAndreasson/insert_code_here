
const MIN_TITLE_LENGTH = 3
const ALL_PROG_LANGUAGES = ["Python", "Kotlin", "C++"] // Hardcoded languages, if one wish to change these, they need to change it at mulitple places
const ALL_DIFFICULTIES = ["Easy", "Medium", "Hard"] // Hardcoded difficulties, if one wish to change these, they need to change it at mulitple places
const MIN_DESCRIPTION_LENGTH = 5
const MIN_AMOUNT_OF_BLANKS = 1

const SOLUTIONS_REGEX = /(?<=\[\[).*?(?=\]\])/g // HARDCODED AT MULIPLE PLACES, should be global instead?
const BLANKS_REGEX = /\[\[INSERT_CODE_HERE\]\]/g

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
        }
    }
}

