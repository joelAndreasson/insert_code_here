document.addEventListener('DOMContentLoaded', function(){
    var textArea = document.querySelector('#play-challenge-textarea')
    var progLanguage = document.querySelector('#language-field')

    function getConfig(){
        switch(progLanguage.value){
            case "JavaScript":
                return configJavascript
            case "Python":
                return configPython
            case "C++":
                return configCPlusPlus
            case "SQL":
                return configSql
            case "Swift":
                return configSwift
            default:
                return configJavascript
        }
    }

    //Create Codemirror instance
    var codeMirrorInstance = CodeMirror.fromTextArea(textArea, getConfig());
})