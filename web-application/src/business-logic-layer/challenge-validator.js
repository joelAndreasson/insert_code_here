
const MIN_TITLE_LENGTH = 3
const ALL_PROG_LANGUAGES = ["Python", "Kotlin", "C++"] // Hardcoded languages, if one wish to change these, they need to change it at mulitple places
const ALL_DIFFICULTIES = ["Easy", "Medium", "Hard"] // Hardcoded difficulties, if one wish to change these, they need to change it at mulitple places
const MIN_DESCRIPTION_LENGTH = 5
const MIN_AMOUNT_OF_BLANKS = 1

const SOLUTIONS_REGEX = /(?<=\[\[).*?(?=\]\])/g // HARDCODED AT MULIPLE PLACES, should be global instead?
const BLANKS_REGEX = /\[\[INSERT_CODE_HERE\]\]/g

module.exports = function({}){
    return{
        getErrorsNewChallenge: function(challenge){
            const errors = []

            const blankAnswers = challenge.challengeText.match(BLANKS_REGEX)
            const solutionAnswers = challenge.solutionText.match(SOLUTIONS_REGEX)

            if(!blankAnswers || blankAnswers.length < MIN_AMOUNT_OF_BLANKS){
                errors.push("There needs to be a minimum of " + MIN_AMOUNT_OF_BLANKS + " [[INSERT_CODE_HERE]] brackets")
            }
            if(!blankAnswers || !solutionAnswers || blankAnswers.length != solutionAnswers.length){
                errors.push("The number of solutions needs to be the same as the number of [[INSERT_CODE_HERE]] brackets")
            }
            

            if(challenge.title.length < MIN_TITLE_LENGTH){
                errors.push("Title needs to be at least " + MIN_TITLE_LENGTH + " characters")
            }
            if(!ALL_PROG_LANGUAGES.includes(challenge.progLanguage)){
                errors.push("Select a valid programming language")
            }
            if(!ALL_DIFFICULTIES.includes(challenge.difficulty)){
                errors.push("Select a valid difficulty")
            }
            if(challenge.description.length < MIN_DESCRIPTION_LENGTH){
                errors.push("Description needs to be at least " + MIN_DESCRIPTION_LENGTH + " characters")
            }

            return errors
        },

        getErrorsPlayChallenge: function(enteredAnswers, solutionAnswers){
            const errors = []

            if(!enteredAnswers || enteredAnswers.length != solutionAnswers.length){
                errors.push("The number of [[INSERT_CODE_HERE]] brackets needs to be the same as it was originally")
            }

            return errors
        }
    }
}

