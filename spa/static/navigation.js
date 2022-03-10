const API_URI = "http://localhost:8080/api/"

let ACCESS_TOKEN = ""

document.addEventListener('DOMContentLoaded', function(){
    
    const navbarBurger = document.getElementById('navbarBurger')
    const navbarMenu = document.getElementById('navbarMenu')

    navbarBurger.addEventListener('click', function(){
        navbarBurger.classList.toggle('is-active')
        navbarMenu.classList.toggle('is-active')
    })
})