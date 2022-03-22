document.addEventListener('DOMContentLoaded', function(){
    var textArea = document.querySelector('#challenge-text')
    var languageSelector = document.querySelector('#language-selector')

    function getConfig(){
        switch(languageSelector.value){
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

    // Codemirror instance
    var codeMirrorInstance = CodeMirror.fromTextArea(textArea, getConfig());

    // recreate Codemirror instance depending on language selected
    languageSelector.addEventListener("change", function() {
        codeMirrorInstance.toTextArea()
        codeMirrorInstance = CodeMirror.fromTextArea(textArea, getConfig());
    });
});