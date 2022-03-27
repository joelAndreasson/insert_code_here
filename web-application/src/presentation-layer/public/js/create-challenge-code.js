document.addEventListener('DOMContentLoaded', function(){
    var textArea = document.querySelector('#challenge-text')
    var languageSelector = document.querySelector('#language-selector')

    function getConfig(){
        switch(languageSelector.value){
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

    // Codemirror instance
    var codeMirrorInstance = CodeMirror.fromTextArea(textArea, getConfig());

    // recreate Codemirror instance depending on language selected
    languageSelector.addEventListener("change", function() {
        codeMirrorInstance.toTextArea()
        codeMirrorInstance = CodeMirror.fromTextArea(textArea, getConfig());
    })
})