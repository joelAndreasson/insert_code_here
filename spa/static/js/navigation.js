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

    document.getElementById('login-form').addEventListener('submit', function(event){
        event.preventDefault()

        const username = document.getElementById('username-input').value
        const password = document.getElementById('password-input').value
        login(username, password)

    })

    document.getElementById('logout-button').addEventListener('click', function(event){
        event.preventDefault()

        logout()
    })

    
    
})

window.addEventListener('popstate', function(){
    hideCurrentPage()
    showPage(location.pathname)
})

function hideCurrentPage(){
    document.querySelector('.current-page').classList.remove('current-page')
}

function makePageLinkListener(element){ //Good name?
    element.addEventListener('click', function(event){
        event.preventDefault()

        console.log("page-link clicked")
        
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
                anchor.classList.add(".page-link") //Unnecessary???
                anchor.setAttribute('href', "/challenges/"+challenge.id)

                makePageLinkListener(anchor)
                
                li.appendChild(anchor)
                
                allChallengesUl.appendChild(li)
            }
            break

        default:
            //500, Handle error
            break

    }

    
}

async function loadChallengePageById(challengeId){
    const response = await fetch(API_URL + "challenges/" + challengeId)

    switch(response.status){
        case 200:
            const challenge = await response.json()

            document.getElementById('challenge-title').innerText = challenge.title
            document.getElementById('challenge-challengeText').innerText = challenge.challengeText
            document.getElementById('challenge-solutionText').innerText = challenge.solutionText
            document.getElementById('challenge-description').innerText = challenge.description
            document.getElementById('challenge-datePublished').innerText = challenge.datePublished
            document.getElementById('challenge-accountUsername').innerText = challenge.accountUsername
            document.getElementById('challenge-numOfPlays').innerText = challenge.numOfPlays
            document.getElementById('challenge-difficulty').innerText = challenge.difficulty
            document.getElementById('challenge-progLanguage').innerText = challenge.progLanguage

            document.getElementById('challenge-play-form').action = "/challenges/" + challenge.id + "/results" //results or play? nothing?
            
            break
        
        case 500:
            //Handle error
            break

        default:
            //404, Handle error
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
        
        default:
            //400, handle error
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
            "Content-Type": "application/json"
        },
        body: JSON.stringify(model)
    })

    //CHECK STATUS CODES AND ACT ACCORDINGLY!

    switch(response.status){
        case 200:
            const responseBody = response.json()

            ACCESS_TOKEN = responseBody.access_token
            ACCOUNT_USERNAME = username
            document.getElementById('login-button').classList.toggle('is-hidden')
            document.getElementById('sign-up-button').classList.toggle('is-hidden')
            document.getElementById('logout-button').classList.toggle('is-hidden')
            document.getElementById('create-challenge-button').classList.toggle('is-hidden')

            break
        
        case 401:
            //Handle error
            break

        default:
            //400, handle error
            break
    }

}

async function logout(){
    ACCESS_TOKEN = ""
    ACCOUNT_USERNAME = ""
    document.getElementById('login-button').classList.toggle('is-hidden')
    document.getElementById('sign-up-button').classList.toggle('is-hidden')
    document.getElementById('logout-button').classList.toggle('is-hidden')    
    document.getElementById('create-challenge-button').classList.toggle('is-hidden')

}
