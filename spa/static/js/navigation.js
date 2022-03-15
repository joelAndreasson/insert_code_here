//import * as challenges from './challenges'
//challenges.testConsoleLog()


// --- navigation.js ---

let ACCESS_TOKEN = ""
let ACCOUNT_USERNAME = ""

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
    
})

window.addEventListener('popstate', function(){
    hideCurrentPage()
    showPage(location.pathname)
})

function hideCurrentPage(){
    document.querySelector('.current-page').classList.remove('current-page')
}

function makePageLinkListener(element){ //Good name?
    element.addEventListener('click', function(event){ //This listnener is
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
    
        default:
            if(url.startsWith("/challenges/")){
                const [empty, challenges, id, results] = url.split("/")
                if(results){ //THIS MIGHT BE THE WRONG WAY TO GO ABOUT IT
                    nextPageId = "results-page"
                }
                else{
                    nextPageId = 'challenge-page'
                    loadChallengePageById(id)
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
    const response = await fetch(API_URL+"challenges")

    //CHECK STATUS CODES AND ACT ACCORDINGLY!

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
}

// --- challenges.js END ---

// --- challenge.js ---


async function loadChallengePageById(id){
    const response = await fetch(API_URL+"challenges/"+id)

    //CHECK STATUS CODES AND ACT ACCORDINGLY!

    console.log(response.status)

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
}


const challengePlayForm = document.getElementById('challenge-play-form')

challengePlayForm.addEventListener('submit', function(event){  // THIS FUNCTION MAY BE WRONG
    event.preventDefault()

    const url = challengePlayForm.getAttribute('action')
    history.pushState(null, "", url)

    const [empty, challenges, challengeId, state] = url.split("/")

    const changedChallengeText = document.getElementById('challenge-challengeText').innerText

    loadResultsPage(challengeId, changedChallengeText)
    hideCurrentPage()
    showPage(url)
    
})

async function loadResultsPage(id, changedChallengeText){ // THIS FUNCTION MAY BE WRONG
    const response = await fetch(API_URL+"challenges/"+id+"/play", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(changedChallengeText)
    })

    const resultsModel = await response.json()

    document.getElementById('challenge-numOfRightAnswers').innerText = resultsModel.numOfRightAnswers
    document.getElementById('challenge-totalNumOfAnswers').innerText = resultsModel.totalNumOfAnswers
}
