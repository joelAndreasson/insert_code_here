
const MIN_TITLE_LENGTH = 3
const MIN_CHALLENGE_TEXT_LENGTH = 5
const MIN_SOLUTION_LENGTH = 5
const ALL_PROG_LANGUAGES = ["Python", "Kotlin", "C++"] // Hardcoded languages, if one wish to change these, tehy nee to change it at mulitple places
const ALL_DIFFICULTIES = ["Easy", "Medium", "Hard"] // Hardcoded difficulties, if one wish to change these, tehy nee to change it at mulitple places
const MIN_DESCRIPTION_LENGTH = 5


exports.getErrorsNewChallenge = function(challenge){ // ADD MORE VALIDATIONS, that there needs to be at least one "[[INSERT_CODE_HERE]] etc"

    const errors = []

    if(challenge.title.length < MIN_TITLE_LENGTH){
        errors.push("Title needs to be at least " + MIN_TITLE_LENGTH + " characters")
    }
    if(challenge.challengeText.length < MIN_CHALLENGE_TEXT_LENGTH){
        errors.push("Challenge text needs to be at least " + MIN_CHALLENGE_TEXT_LENGTH + " characters")
    }
    if(challenge.solutionText.length < MIN_SOLUTION_LENGTH){
        errors.push("Solution text needs to be at least " + MIN_SOLUTION_LENGTH + " characters")
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
}