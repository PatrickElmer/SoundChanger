document.getElementById('soundChangeForm').addEventListener('submit', handleFormSubmit)

function handleFormSubmit(event) {
    event.preventDefault()

    const changesInput = document.getElementById('changes')
    const stringsInput = document.getElementById('strings')

    const changes = changesInput.value.trim().split('\n')
    const strings = stringsInput.value.trim().split('\n')
    const categories = {
        "V": ["i", "y", "ɨ", "ʉ", "ɯ", "u", "ɪ", "ʏ", "ʊ", "e", "ø", "ɘ", "ɵ", "ɤ", "o", "ə", "ɛ", "œ", "ɜ", "ɞ", "ʌ", "ɔ", "æ", "ɐ", "a", "ɶ", "ä", "ɑ", "ɒ"]
    }
    const zeroCharacters = '∅-'

    const result = apply(changes, strings, categories, zeroCharacters)
    displayResult(result)

    if (document.querySelector('#switch').checked) {
        navigator.clipboard.writeText(result.join('\n'))
    }
}

function apply(changes, strings, categories = {}, zeroCharacters = '∅-') {
    changes = Array.isArray(changes) ? changes : [changes]
    strings = Array.isArray(strings) ? [...strings] : [strings]

    for (const change of changes) {
        let reformattedChange = reformatChangeToRegex(change, categories, zeroCharacters)
        const [original, changeTo, before, after] = splitChange(reformattedChange)

        if (changeTo === undefined) {
            console.log(`Failed to apply change "${change}".`)
            continue
        }
        const pattern = `(?<=${before})(${original})(?=${after})`

        strings = strings.map(string => {
            return `#${string}#`.replace(new RegExp(pattern, 'g'), changeTo).replace(/#/g, '').trim()
        })
    }
    return strings
}

function displayResult(result) {
    const resultElement = document.getElementById('result')
    resultElement.innerText = result.join('\n')

}

const regexEscape = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function reformatChangeToRegex(change, categories = {}, zeroCharacters = '∅-') {
    const replacements = { ' ': '', '{': '(', '}': ')', ',': '|' }

    for (const [key, value] of Object.entries(replacements)) {
        change = change.replace(new RegExp(regexEscape(key), 'g'), value)
    }

    for (const [category, categoryValues] of Object.entries(categories)) {
        const categoryPattern = new RegExp(regexEscape(category), 'g')
        change = change.replace(categoryPattern, `(${categoryValues.join('|')})`)
        change = change.replace(new RegExp(`((?<=,)${regexEscape(category)})|(${regexEscape(category)}(?=,))`, 'g'), categoryValues.join('|'))
    }

    for (const char of zeroCharacters) {
        change = change.replace(new RegExp(regexEscape(char), 'g'), '')
    }

    return change
}

function splitChange(change) {
    if (!change.includes('/')) {
        change += '/'
    }

    const [changePart, environmentPart] = change.split('/')
    const environment = environmentPart.replace(/_+/g, '_')
    const [original, changeTo] = changePart.split('>')

    let before = ''
    let after = ''
    if (environment.includes('_')) {
        [before, after] = environment.split('_')
    }

    return [original, changeTo, before, after]
}
