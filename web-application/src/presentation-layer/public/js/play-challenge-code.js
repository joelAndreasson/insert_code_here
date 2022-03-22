document.addEventListener('DOMContentLoaded', function(){
    var textArea = document.querySelector('#play-challenge-textarea')
    var progLanguage = document.querySelector('#language-field')

    function getConfig(){
        switch(progLanguage.value){
            case "JavaScript":
                return configJavascript
                break;
            case "Python":
                return configPython
                break;
            case "C++":
                return configCPlusPlus
                break;
            case "SQL":
                return configSql
                break;
            case "Swift":
                return configSwift
                break;
            default:
                return configJavascript
        }
    }

    //Create Codemirror instance
    var codeMirrorInstance = CodeMirror.fromTextArea(textArea, getConfig());
});