import { describe, it, expect } from 'vitest'
import { reformatChangeToRegex } from '../soundchanger.js'

describe('reformatChangeToRegex', () => {
    it('No change', () => {
        expect(reformatChangeToRegex("a>b")).toBe("a>b")
    })
    it('No change', () => {
        expect(reformatChangeToRegex("a>b/{c,d}")).toBe("a>b/(c|d)")
    })
})
