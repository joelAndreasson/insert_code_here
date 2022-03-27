module.exports = function({validationVariabels, challengeRepository}){
    return{
        getErrorsUpdateChallenge: function(requesterUsername, challengeId, updatedChallenge, callback){
            const errorCodes = []

            const blankAnswers = updatedChallenge.challengeText.match(validationVariabels.BLANKS_REGEX)
            const solutionAnswers = updatedChallenge.solutionText.match(validationVariabels.SOLUTIONS_REGEX)

            challengeRepository.getChallengeById(challengeId, function(errors, challenge){
                if(errors.length > 0){
                    errorCodes.push(...errors)
                    callback(errorCodes)
                }
                else{
                    const ownerUsername = challenge.accountUsername

                    if(ownerUsername != requesterUsername){
                        errorCodes.push(validationVariabels.notAuthorized)
                    }
        
                    if(!blankAnswers || blankAnswers.length < validationVariabels.MIN_AMOUNT_OF_BLANKS){
                        errorCodes.push(validationVariabels.notEnoughBlanks)
                    }
                    if(!blankAnswers || !solutionAnswers || blankAnswers.length != solutionAnswers.length){
                        errorCodes.push(validationVariabels.solutionsNotMatchBlanks)
                    }
                    
        
                    if(updatedChallenge.title.length < validationVariabels.MIN_TITLE_LENGTH){
                        errorCodes.push(validationVariabels.titleTooShort)
                    }
                    if(!validationVariabels.ALL_PROG_LANGUAGES.includes(updatedChallenge.progLanguage)){
                        errorCodes.push(validationVariabels.progLanguageNotValid)
                    }
                    if(!validationVariabels.ALL_DIFFICULTIES.includes(updatedChallenge.difficulty)){
                        errorCodes.push(validationVariabels.difficultyNotValid)
                    }
                    if(updatedChallenge.description.length < validationVariabels.MIN_DESCRIPTION_LENGTH){
                        errorCodes.push(validationVariabels.descriptionTooShort)
                    }

        
                    callback(errorCodes)
                }
                
            })
        },

        getErrorsNewChallenge: function(requesterUsername, challenge){
            const errors = [] // errorCodes

            const blankAnswers = challenge.challengeText.match(validationVariabels.BLANKS_REGEX)
            const solutionAnswers = challenge.solutionText.match(validationVariabels.SOLUTIONS_REGEX)

            if(challenge.accountUsername != requesterUsername){
                errors.push(validationVariabels.notAuthorized)
            }

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
            const errorCodes = []

            if(!enteredAnswers || enteredAnswers.length != solutionAnswers.length){
                errorCodes.push(validationVariabels.numOfBlanksChanged)
            }

            return errorCodes
        },

        getErrorsFetchChallenge: function(challenge){
            const errorCodes = []
            if(challenge == undefined){
                errorCodes.push(validationVariabels.challengeNotExist)
            }
            return errorCodes
        },

        getErrorsDeleteChallenge: function(challengeId, requesterUsername, callback){
            const errorCodes = []

            challengeRepository.getChallengeById(challengeId, function(errors, challenge){
                if(errors.length > 0){
                    errorCodes.push(...errors)
                    callback(errorCodes)
                }
                else{
                    const ownerUsername = challenge.accountUsername

                    if(ownerUsername != requesterUsername){
                        errorCodes.push(validationVariabels.notAuthorized)
                    }

                    callback(errorCodes)
                }
            })
            
        }

    }
}

