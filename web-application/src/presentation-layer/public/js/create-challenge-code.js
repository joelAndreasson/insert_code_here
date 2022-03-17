document.addEventListener('DOMContentLoaded', function(){
    var textArea = document.querySelector('#challenge-text')
    var languageSelector = document.querySelector('#language-selector')
    
    //------- configs depending on selected language ----
    var configPython = {
            lineNumbers: true,
            tabSize: 2,
            value: '// write code here',
            mode: {
                name: "python",
                version: 3,
                singleLineStringErrors: false
            },
        }
    var configJavascript = {
        lineNumbers: true,
        tabSize: 2,
        value: '// write code here',
        mode: 'javascript'
    }
    // -------------------------------------------------

    function getConfig(){
        switch(languageSelector.value){
            case "JavaScript":
                return configJavascript
                break;
            case "Python":
                return configPython
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