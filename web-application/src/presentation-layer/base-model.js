
module.exports = function({}){
    
    function baseModel(request, response, next){
        response.locals.isLoggedIn = request.session.isLoggedIn
        //response.locals.csrfToken = request.csrfToken()
        next()
    }

    return baseModel
    
}