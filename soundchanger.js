if (globalThis.document) document.getElementById('soundChangeForm').addEventListener('submit', handleFormSubmit)

function handleFormSubmit(event) {
    event.preventDefault()

    const changesInput = document.getElementById('changes')
    const stringsInput = document.getElementById('strings')

    const changes = changesInput.value.trim().split('\n')
    const strings = stringsInput.value.trim().split('\n')
    const categories = {
        "V": ["i", "y", "ɨ", "ʉ", "ɯ", "u", "ɪ", "ʏ", "ʊ", "e", "ø", "ɘ", "ɵ", "ɤ", "o", "ə", "ɛ", "œ", "ɜ", "ɞ", "ʌ", "ɔ", "æ", "ɐ", "a", "ɶ", "ä", "ɑ", "ɒ"]
    }
    const zeroCharacters = ["∅", "-"]

    const result = apply(changes, strings, categories, zeroCharacters)
    displayResult(result)

    if (document.querySelector('#switch').checked) {
        navigator.clipboard.writeText(result.join('\n'))
    }
}

export function apply(changes, strings, categories={}, zeroCharacters=["∅", "-"]) {
    for (const change of changes) {
        let reformattedChange = reformatChangeToRegex(change, categories, zeroCharacters)
        const [original, changeTo, before, after] = splitChange(reformattedChange)

        if (changeTo === undefined) {
            console.log(`Failed to apply change "${change}".`)
            continue
        }
        let pattern = before == "#" ? "^" : `(?<=${before})`
        pattern += `(${original})`
        pattern += after == "#" ? "$" : `(?=${after})`

        strings = strings.map(
            string => string.replace(new RegExp(pattern, 'g'), changeTo)
        )
    }
    return strings
}

function displayResult(result) {
    const resultElement = document.getElementById('result')
    resultElement.innerText = result.join('\n')
}

export function reformatChangeToRegex(change, categories = {}, zeroCharacters = ["∅", "-"]) {
    const replacements = { ' ': '', '{': '(', '}': ')', ',': '|' }

    for (const [key, value] of Object.entries(replacements)) {
        change = change.replace(key, value)
    }

    for (const [category, categoryValues] of Object.entries(categories)) {
        change = change.replace(category, `(${categoryValues.join('|')})`)
    }

    change = change.replace(new RegExp(`(${zeroCharacters.join('|')})`, 'g'), '')

    return change
}

export function splitChange(change) {
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
