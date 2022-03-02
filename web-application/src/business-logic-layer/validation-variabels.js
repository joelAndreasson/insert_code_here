
//All validation variables, regex and arrays
module.exports = {
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 10,
    MIN_TITLE_LENGTH: 3,
    ALL_PROG_LANGUAGES: ["Python", "Kotlin", "C++"],
    ALL_DIFFICULTIES: ["Easy", "Medium", "Hard"],
    MIN_DESCRIPTION_LENGTH: 5,
    MIN_AMOUNT_OF_BLANKS: 1,
    SOLUTIONS_REGEX: /(?<=\[\[).*?(?=\]\])/g,
    BLANKS_REGEX: /\[\[INSERT_CODE_HERE\]\]/g,
    MIN_COMMENT_LENGTH: 5
}
