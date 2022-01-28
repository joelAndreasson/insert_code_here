const express = require('express')

const app = express()

app.get('/', function(request, response){
  response.send("Hello, World! Greetings from Linux! Docker compose is working :)")
})

app.listen(8080, function(){
  console.log("Web application listening on port 8080.")
})