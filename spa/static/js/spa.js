

// ---------- Navigation ----------

document.addEventListener('DOMContentLoaded', function(){

    const navbarBurger = document.getElementById('navbarBurger')
    const navbarMenu = document.getElementById('navbarMenu')

    navbarBurger.addEventListener('click', function(){
        navbarBurger.classList.toggle('is-active')
        navbarMenu.classList.toggle('is-active')
    })

    const pageLinks = document.querySelectorAll('.page-link')

    for(const pageLink of pageLinks){
        makePageLinkListener(pageLink)
    }

    showPage(location.pathname)

    //Challenge play form
    const challengePlayForm = document.getElementById('challenge-play-form') // CURRENTLY ALWAYS TAKES YOU TO RESULTS PAGE, EVEN IF SUBMIT IS NOT VALID
    challengePlayForm.addEventListener('submit', function(event){
        event.preventDefault()

        const url = challengePlayForm.getAttribute('action')

        const [empty, challenges, challengeId, state] = url.split("/")

        const changedChallengeText = document.getElementById('challenge-challengeText').value

        loadResultsPage(url, challengeId, changedChallengeText)
        
    })

    //Login form
    document.getElementById('login-form').addEventListener('submit', function(event){
        event.preventDefault()

        const username = document.getElementById('login-username').value
        const password = document.getElementById('login-password').value
        login(username, password)

    })

    //Sign up form
    document.getElementById('sign-up-form').addEventListener('submit', function(event){
        event.preventDefault()

        const username = document.getElementById('sign-up-username').value
        const password = document.getElementById('sign-up-password').value //NOT WORKING
        const password2 = document.getElementById('sign-up-password2').value //NOT WORKING

        console.log(username, password, password2)

        signUp(username, password, password2)
    })

    //Logout
    document.getElementById('logout-button').addEventListener('click', function(event){
        event.preventDefault()
        logout()
    }); //SEMI COLON NECESSARY!

    (async function(){ //USE THIS OR CALLBACKS??
        const progLanguageSelector = document.getElementById('prog-language-selector')
        const progLanguageSelectorUpdate = document.getElementById('prog-language-selector-update')
        const allProgLanguages = await getAllProgLanguages()

        console.log(allProgLanguages)
    
        for(const progLanguage of allProgLanguages){
            const option = document.createElement('option')
            option.innerText = progLanguage
            progLanguageSelector.appendChild(option)

            const optionUpdate = document.createElement('option')
            optionUpdate.innerText = progLanguage
            progLanguageSelectorUpdate.appendChild(optionUpdate)
        }
    })(); //SEMI COLON NECESSARY!

    (async function(){ //USE THIS OR CALLBACKS??
        const allDifficultiesSelector = document.getElementById('difficulty-selector')
        const allDifficultiesSelectorUpdate = document.getElementById('difficulty-selector-update')
        const allDifficulties = await getAllDifficulties()

        for(const difficulty of allDifficulties){
            const option = document.createElement('option')
            option.innerText = difficulty
            allDifficultiesSelector.appendChild(option)

            const optionUpdate = document.createElement('option')
            optionUpdate.innerText = difficulty
            allDifficultiesSelectorUpdate.appendChild(optionUpdate)
        }
    })(); //SEMI COLON NECESSARY!

    document.getElementById('create-challenge-form').addEventListener('submit', function(event){
        event.preventDefault()

        const title = document.getElementById('title-input').value
        const progLanguage = document.getElementById('prog-language-selector').value
        const challengeText = document.getElementById('challenge-text-input').value
        const solutionText = document.getElementById('solution-text-input').value
        const description = document.getElementById('description-input').value
        const difficulty = document.getElementById('difficulty-selector').value

        const challenge = {
            title: title,
            progLanguage: progLanguage,
            challengeText: challengeText,
            solutionText: solutionText,
            description: description,
            difficulty: difficulty,
            accountUsername: ACCOUNT_USERNAME
        }

        createChallenge(challenge)
    })

})

window.addEventListener('popstate', function(){
    hideCurrentPage()
    showPage(location.pathname)
})

function hideCurrentPage(){
    hideErrors()
    document.querySelector('.current-page').classList.remove('current-page')
}

function makePageLinkListener(element){
    element.addEventListener('click', function(event){
        event.preventDefault()
        
        const url = element.getAttribute('href')

        history.pushState(null, "", url)

        hideCurrentPage()
        showPage(url)
    })  
}

function showPage(url){
    let nextPageId

    console.log(url)

    switch (url) {
        case '/':
            nextPageId = 'home-page'
            break

        case '/about':
            nextPageId = 'about-page'
            break

        case '/contact':
            nextPageId = 'contact-page'
            break

        case '/challenges':
            loadChallengesPage()
            nextPageId = 'challenges-page'
            break

        case '/sign-up':
            nextPageId = 'sign-up-page'
            break

        case '/login':
            nextPageId = 'login-page'
            break

        case '/challenges/create':
            nextPageId = "create-challenge-page"
            break
    
        default:
            if(url.startsWith("/challenges/")){
                const [empty, challenges, challengeId, state] = url.split("/") //Should it be state?
                
                switch(state){
                    case 'results':
                        nextPageId = "results-page"
                        break

                    case 'delete':
                        nextPageId = "delete-challenge-page"
                        break

                    case 'update':
                        nextPageId = "update-challenge-page"
                        break
                    
                    default:
                        nextPageId = 'challenge-page'
                        loadChallengePageById(challengeId)
                        break
                }
                
            }
            else{
                nextPageId = 'not-found-page'
            }
            break
    }

    console.log(nextPageId)
    document.getElementById(nextPageId).classList.add('current-page')
}

// ---------- Navigation END ----------



// ---------- Challenges ----------
const API_URL = "http://localhost:3000/api/"

async function getAllProgLanguages(){
    const response = await fetch(API_URL + "progLanguages")
    const allProgLanguages = await response.json()
    return allProgLanguages
}

async function getAllDifficulties(){
    const response = await fetch(API_URL + "difficulties")
    const allDifficulties = await response.json()
    return allDifficulties
}





async function createChallenge(challenge){
    const response = await fetch(API_URL + "challenges", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + ACCESS_TOKEN
        },
        body: JSON.stringify(challenge)
    })

    switch(response.status){
        case 201:
            hideErrors()
            const challengeId = await response.json()
            console.log(challengeId)
            hideCurrentPage()
            showPage('/challenges/' + challengeId) // NOT WORKING // Hardcoded ???
            break

        case 401:
            const authErrors = await response.json()
            translateAndShowErrors(authErrors)
            break

        case 400:
            const requestErrors = await response.json()
            translateAndShowErrors(requestErrors)
            break

        case 500:
            const serverErrors = await response.json()
            translateAndShowErrors(serverErrors)
            break

        default:
            translateAndShowErrors(['defaultError'])
            break

    }
}




async function deleteChallengeById(challengeId){
    const response = await fetch(API_URL + "challenges/" + challengeId + "/delete", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + ACCESS_TOKEN
        }
    })

    switch(response.status){
        case 204:
            hideErrors()

            const url = ('/challenges')
            history.pushState(null, "", url)

            hideCurrentPage()
            showPage('/challenges')
            break

        case 401:
            const authErrors = await response.json()
            translateAndShowErrors(authErrors)
            break

        case 404:
            hideCurrentPage()
            showPage('/not-found')
            break

        case 500:
            const serverErrors = await response.json()
            translateAndShowErrors(serverErrors)
            break

        default:
            translateAndShowErrors(['defaultError'])
            break
            
    }
}




async function updateChallengeById(challengeId, updatedChallenge){
    const response = await fetch(API_URL + "challenges/" + challengeId + "/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + ACCESS_TOKEN
        },
        body: JSON.stringify(updatedChallenge)
    })

    switch(response.status){
        case 204:
            hideErrors()

            const url = ('/challenges/' + challengeId)
            history.pushState(null, "", url)

            hideCurrentPage()
            showPage('/challenges/' + challengeId) // Hardcoded ???
            break

        case 401:
            const authErrors = await response.json()
            translateAndShowErrors(authErrors)
            break

        case 400:
            const requestErrors = await response.json()
            translateAndShowErrors(requestErrors)
            break

        case 500:
            const serverErrors = await response.json()
            translateAndShowErrors(serverErrors)
            break

        default:
            translateAndShowErrors(['defaultError'])
            break
    }
}




async function loadChallengesPage(){
    const response = await fetch(API_URL + "challenges")

    switch(response.status){
        case 200:
            hideErrors()
            const challenges = await response.json()

            const allChallengesUl = document.getElementById('all-challenges')
            allChallengesUl.innerText = ""

            for(const challenge of challenges){
                const li = document.createElement('li')
                
                const anchor = document.createElement('a')
                anchor.innerText = challenge.title
                anchor.classList.add('.page-link') //Unnecessary???
                anchor.setAttribute('href', "/challenges/" + challenge.id)

                makePageLinkListener(anchor)
                
                li.appendChild(anchor)
                
                allChallengesUl.appendChild(li)
            }
            break

        case 500:
            const serverErrors = await response.json()
            translateAndShowErrors(serverErrors)
            break

        default:
            translateAndShowErrors(['defaultError'])
            break

    }    
}




function loadDeleteChallengePageById(challengeId){
    const oldDeleteButton = document.getElementById("confirm-delete");
    const newDeleteButton = oldDeleteButton.cloneNode(true);

    newDeleteButton.addEventListener('click', function(event){
        event.preventDefault()
        deleteChallengeById(challengeId)
    })
    oldDeleteButton.parentNode.replaceChild(newDeleteButton, oldDeleteButton);

    const oldCancelButton = document.getElementById("cancel-delete");
    const newCancelButton = oldCancelButton.cloneNode(true);
    newCancelButton.addEventListener('click', function(event){
        event.preventDefault()

        const url = ('/challenges/' + challengeId)
        history.pushState(null, "", url)
        
        hideCurrentPage()
        showPage('/challenges/' + challengeId)
    })
    oldCancelButton.parentNode.replaceChild(newCancelButton, oldCancelButton);
}




function loadUpdateChallengePageById(challengeId, oldChallenge){
    const oldUpdateButton = document.getElementById("confirm-update")
    const newUpdateButton = oldUpdateButton.cloneNode(true)

    const newTitleInput = document.getElementById('new-title')
    const newProgLanguageSelector = document.getElementById('prog-language-selector-update')
    const newChallengeTextInput = document.getElementById('new-challenge-text')
    const newSolutionTextInput = document.getElementById('new-solution-text')
    const newDescriptionInput = document.getElementById('new-description')
    const newDifficultySelector = document.getElementById('difficulty-selector-update')

    newTitleInput.value = oldChallenge.title
    newProgLanguageSelector.value = oldChallenge.progLanguage
    newChallengeTextInput.value = oldChallenge.challengeText
    newSolutionTextInput.value = oldChallenge.solutionText
    newDescriptionInput.value = oldChallenge.description
    newDifficultySelector.value = oldChallenge.difficulty


    newUpdateButton.addEventListener('click', function(event){
        event.preventDefault()

        const newTitle = newTitleInput.value
        const newProgLanguage = newProgLanguageSelector.value
        const newChallengeText = newChallengeTextInput.value
        const newSolutionText = newSolutionTextInput.value
        const newDescription = newDescriptionInput.value
        const newDifficulty = newDifficultySelector.value

        const updatedChallenge = {
            title: newTitle,
            progLanguage: newProgLanguage,
            challengeText: newChallengeText,
            solutionText: newSolutionText,
            description: newDescription,
            difficulty: newDifficulty
        }

        updateChallengeById(challengeId, updatedChallenge)
    })

    oldUpdateButton.parentNode.replaceChild(newUpdateButton, oldUpdateButton);

    const oldCancelButton = document.getElementById("cancel-update");
    const newCancelButton = oldCancelButton.cloneNode(true);
    newCancelButton.addEventListener('click', function(event){
        event.preventDefault()
        
        const url = ('/challenges/' + challengeId)
        history.pushState(null, "", url)

        hideCurrentPage()
        showPage('/challenges/' + challengeId)
    })
    oldCancelButton.parentNode.replaceChild(newCancelButton, oldCancelButton);
}




async function loadChallengePageById(challengeId){
    const response = await fetch(API_URL + "challenges/" + challengeId)

    switch(response.status){
        case 200:
            hideErrors()
            const challenge = await response.json()

            const challengeOptions = document.getElementById('challenge-options')
            challengeOptions.classList.add('is-hidden')

            document.getElementById('challenge-title').innerText = challenge.title
            document.getElementById('challenge-challengeText').value = challenge.challengeText
            document.getElementById('challenge-description').innerText = challenge.description
            document.getElementById('challenge-datePublished').innerText = challenge.datePublished
            document.getElementById('challenge-accountUsername').innerText = challenge.accountUsername
            document.getElementById('challenge-numOfPlays').innerText = challenge.numOfPlays
            document.getElementById('challenge-difficulty').innerText = challenge.difficulty
            document.getElementById('challenge-progLanguage').innerText = challenge.progLanguage

            document.getElementById('challenge-play-form').action = "/challenges/" + challengeId + "/results"

            if(challenge.accountUsername == ACCOUNT_USERNAME){
                challengeOptions.classList.toggle('is-hidden')

                const oldDeleteButton = document.getElementById("delete-challenge-button");
                const newDeleteButton = oldDeleteButton.cloneNode(true);

                newDeleteButton.addEventListener('click', function(event){
                    event.preventDefault()

                    loadDeleteChallengePageById(challengeId)

                    const url = ('/challenges/' + challengeId + '/delete')
                    history.pushState(null, "", url)

                    hideCurrentPage()
                    showPage(url)
                })
                oldDeleteButton.parentNode.replaceChild(newDeleteButton, oldDeleteButton);

                const oldUpdateButton = document.getElementById("update-challenge-button");
                const newUpdateButton = oldUpdateButton.cloneNode(true);
                newUpdateButton.addEventListener('click', function(event){
                    event.preventDefault()

                    loadUpdateChallengePageById(challengeId, challenge)

                    const url = ('/challenges/' + challengeId + '/update')
                    history.pushState(null, "", url)
                    
                    hideCurrentPage()
                    showPage(url)
                })
                oldUpdateButton.parentNode.replaceChild(newUpdateButton, oldUpdateButton);

            }
            
            break
        
        case 500:
            const serverErrors = await response.json()
            translateAndShowErrors(serverErrors)
            break

        case 404:
            hideCurrentPage()
            showPage('/not-found')
            break

        default:
            translateAndShowErrors(['defaultError'])
            break
    }

    
}

async function loadResultsPage(url, challengeId, changedChallengeText){

    const model = {
        changedChallengeText: changedChallengeText
    }

    const response = await fetch(API_URL + "challenges/" + challengeId + "/play", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(model)
    })    

    switch(response.status){
        case 200:
            hideErrors()

            history.pushState(null, "", url)

            hideCurrentPage()
            showPage(url)
            const responseBody = await response.json()
            document.getElementById('challenge-numOfRightAnswers').innerText = responseBody.numOfRightAnswers
            document.getElementById('challenge-totalNumOfAnswers').innerText = responseBody.totalNumOfAnswers
            break
        
        case 500:
            const serverErrors = await response.json()
            translateAndShowErrors(serverErrors)
            break

        case 400:
            const requestErrors = await response.json()
            translateAndShowErrors(requestErrors)
            break
        
        default:
            translateAndShowErrors(['defaultError'])
            break
    }

    
}

// ---------- Challenges END ----------



// ---------- Accounts ----------

let ACCESS_TOKEN = ""
let ACCOUNT_USERNAME = ""

async function login(username, password){

    const model = {
        username: username,
        password: password,
        grant_type: "password"
        
    }

    const response = await fetch(API_URL + "tokens", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(model)
    })

    switch(response.status){
        case 200:
            hideErrors()
            const responseBody = await response.json()

            ACCESS_TOKEN = responseBody.access_token
            ACCOUNT_USERNAME = username
            document.getElementById('login-button').classList.toggle('is-hidden')
            document.getElementById('sign-up-button').classList.toggle('is-hidden')
            document.getElementById('logout-button').classList.toggle('is-hidden')
            document.getElementById('create-challenge-button').classList.toggle('is-hidden')

            hideCurrentPage()
            showPage('/')

            break
        
        case 401:
            const authErrors = await response.json()
            translateAndShowErrors(authErrors)
            break

        case 400:
            const requestErrors = await response.json()
            translateAndShowErrors(requestErrors)
            break

        case 500:
            const serverErrors = await response.json()
            translateAndShowErrors(serverErrors)
            break

        default:
            translateAndShowErrors(['defaultError'])
            break
    }

}

function logout(){
    ACCESS_TOKEN = ""
    ACCOUNT_USERNAME = ""
    document.getElementById('login-button').classList.toggle('is-hidden')
    document.getElementById('sign-up-button').classList.toggle('is-hidden')
    document.getElementById('logout-button').classList.toggle('is-hidden')    
    document.getElementById('create-challenge-button').classList.toggle('is-hidden')
}

async function signUp(username, password, password2){
    const accountInformation = {
        username: username,
        password: password,
        password2: password2
    }

    const response = await fetch(API_URL + "accounts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(accountInformation)
    })

    switch(response.status){
        case 201:
            hideErrors()
            const account = await response.json()
            login(account.username, account.password)
            break
        
        case 500:
            const serverErrors = await response.json()
            translateAndShowErrors(serverErrors)
            break

        case 400:
            const requestErrors = await response.json()
            translateAndShowErrors(requestErrors)
            break
        
        default:
            translateAndShowErrors(['defaultError'])
            break
    }
}

// ---------- Accounts END ----------



// ---------- Validation ----------

const validationVariabels = getValidationVariables()

async function getValidationVariables(){
    const response = await fetch(API_URL + "validationVariables")
    const variabels = await response.json()
    return variabels
}

function translateErrorCodes(errorCodes){
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
        passwordToShort: "Password must be more than " + validationVariabels.MIN_PASSWORD_LENGTH + " characters",
        passwordToLong: "Password cannot be more than " + validationVariabels.MAX_PASSWORD_LENGTH + " characters",
        usernameTaken: "Username already taken",
        defaultError: "Oops, something went wrong, please try again later..."
    }

    const translations = errorCodes.map(error => errorTranslations[error])
    return translations
}

function translateAndShowErrors(errorCodes){
    const translatedErrors = translateErrorCodes(errorCodes)
    const errorsListUl = document.getElementById('errors-list')
    errorsListUl.innerText = ""

    for(const error of translatedErrors){

        const li = document.createElement('li')
        li.innerText = error.toString()
        
        errorsListUl.appendChild(li)
    }

    document.getElementById('errors-div').classList.remove('is-hidden')
}

function hideErrors(){
    document.getElementById('errors-div').classList.add('is-hidden')
}

// ---------- Validation END----------