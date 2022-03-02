
module.exports = function({}){
    
    function baseModel(request, response, next){
        response.locals.isLoggedIn = request.session.isLoggedIn
        response.locals.accountId = request.session.accountId
        //response.locals.csrfToken = request.csrfToken()
        next()
    }

    return baseModel
    
}