//import * as challenges from './challenges'
//challenges.testConsoleLog()


// --- navigation.js ---

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
    const challengePlayForm = document.getElementById('challenge-play-form')
    challengePlayForm.addEventListener('submit', function(event){
        event.preventDefault()

        const url = challengePlayForm.getAttribute('action')
        history.pushState(null, "", url)

        const [empty, challenges, challengeId, state] = url.split("/") //Should it say state?

        const changedChallengeText = document.getElementById('challenge-challengeText').value

        loadResultsPage(challengeId, changedChallengeText)
        hideCurrentPage()
        showPage(url)
        
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
    
        for(const progLanguage of allProgLanguages){
            const option = document.createElement('option')
            option.innerText = progLanguage
            progLanguageSelector.appendChild(option)
            progLanguageSelectorUpdate.appendChild(option)
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
            allDifficultiesSelectorUpdate.appendChild(option)
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
                
                switch(state){ //Switch or if-statment?
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

    document.getElementById(nextPageId).classList.add('current-page')
}

// --- navigation.js END ---

// --- challenges.js ---
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
            const createdChallenge = await response.json()
            hideCurrentPage()
            showPage('challenges/' + createdChallenge.id) // NOT WORKING // Hardcoded ???
            break

        case 401:
            //Handle error
            break

        case 400:
            //Handle error
            break

        case 500:
            //Handle error
            break

        default:
            //Handle error

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
            hideCurrentPage()
            showPage('/challenges') // Hardcoded ???
            break

        case 401:
            //Handle error
            break

        case 404:
            //Handle error
            break

        case 500:
            //handle error
            break

        default:
            //handle error
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
            hideCurrentPage()
            showPage('/challenges/' + challengeId) // Hardcoded ???
            break

        case 401:
            //Handle error
            break

        case 400:
            //Handle error
            break

        case 500:
            //handle error
            break

        default:
            //handle error
            break
    }
}


async function loadChallengesPage(){
    const response = await fetch(API_URL + "challenges")

    switch(response.status){
        case 200:
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
            //handle error
            break

        default:
            //Handle error
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
        
        hideCurrentPage()
        showPage('/challenges/' + challengeId)
    })
    oldCancelButton.parentNode.replaceChild(newCancelButton, oldCancelButton);
}

function loadUpdateChallengePageById(challengeId, oldChallenge){
    const oldUpdateButton = document.getElementById("confirm-update");
    const newUpdateButton = oldUpdateButton.cloneNode(true);

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
        
        hideCurrentPage()
        showPage('/challenges/' + challengeId)
    })
    oldCancelButton.parentNode.replaceChild(newCancelButton, oldCancelButton);
}

async function loadChallengePageById(challengeId){
    const response = await fetch(API_URL + "challenges/" + challengeId)

    switch(response.status){
        case 200:
            const challenge = await response.json()

            const challengeOptions = document.getElementById('challenge-options')
            challengeOptions.classList.add('is-hidden')

            document.getElementById('challenge-title').innerText = challenge.title
            document.getElementById('challenge-challengeText').innerText = challenge.challengeText
            document.getElementById('challenge-solutionText').innerText = challenge.solutionText
            document.getElementById('challenge-description').innerText = challenge.description
            document.getElementById('challenge-datePublished').innerText = challenge.datePublished
            document.getElementById('challenge-accountUsername').innerText = challenge.accountUsername
            document.getElementById('challenge-numOfPlays').innerText = challenge.numOfPlays
            document.getElementById('challenge-difficulty').innerText = challenge.difficulty
            document.getElementById('challenge-progLanguage').innerText = challenge.progLanguage

            document.getElementById('challenge-play-form').action = "/challenges/" + challengeId + "/results" //results or play? nothing?

            if(challenge.accountUsername == ACCOUNT_USERNAME){
                challengeOptions.classList.toggle('is-hidden')

                const oldDeleteButton = document.getElementById("delete-challenge-button");
                const newDeleteButton = oldDeleteButton.cloneNode(true);

                newDeleteButton.addEventListener('click', function(event){
                    event.preventDefault()

                    loadDeleteChallengePageById(challengeId)

                    hideCurrentPage()
                    showPage('/challenges/' + challengeId + '/delete')
                })
                oldDeleteButton.parentNode.replaceChild(newDeleteButton, oldDeleteButton);

                const oldUpdateButton = document.getElementById("update-challenge-button");
                const newUpdateButton = oldUpdateButton.cloneNode(true);
                newUpdateButton.addEventListener('click', function(event){
                    event.preventDefault()

                    loadUpdateChallengePageById(challengeId, challenge)
                    
                    hideCurrentPage()
                    showPage('/challenges/' + challengeId + '/update')
                })
                oldUpdateButton.parentNode.replaceChild(newUpdateButton, oldUpdateButton);

            }
            
            break
        
        case 500:
            //Handle error
            break

        case 404:
            //handle error
            break

        default:
            //Handle error
            break
    }

    
}

async function loadResultsPage(challengeId, changedChallengeText){

    const model = {
        changedChallengeText: changedChallengeText
    }
    //CHECK STATUS CODES AND ACT ACCORDINGLY!
    const response = await fetch(API_URL + "challenges/" + challengeId + "/play", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(model)
    })

    switch(response.status){
        case 200:
            const responseBody = await response.json()
            document.getElementById('challenge-numOfRightAnswers').innerText = responseBody.numOfRightAnswers
            document.getElementById('challenge-totalNumOfAnswers').innerText = responseBody.totalNumOfAnswers
            break
        
        case 500:
            //Handle error
            break

        case 400:
            //Handle error
            break
        
        default:
            //handle error
            break
    }

    
}

// --- challenges.js END ---

// --- accounts.js ---
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

    //CHECK STATUS CODES AND ACT ACCORDINGLY!

    switch(response.status){
        case 200:
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
            //Handle error
            break

        case 400:
            //handle error
            break

        default:
            //handle error
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
            const account = await response.json()
            login(account.username, account.password)
            break
        
        case 500:
            //handle error
            break

        case 400:
            //handle error
            break
        
        default:
            //handle error
            break
    }
}
