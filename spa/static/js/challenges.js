// --- challenges.js ---
const API_URL = "http://localhost:3000/api/"

async function loadChallengesPage(){
    const response = await fetch(API_URL+challenges)

    const challenges = await response.json()
}
